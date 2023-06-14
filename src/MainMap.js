import React, {useEffect, useRef, useState} from 'react';
import './styles/App.css';
import axios from "axios";
import AuthRoutes from "./AuthRoutes";
import {Circle, Map, Placemark, YMaps} from "@pbe/react-yandex-maps";
import {Button, Container, Flex, NumberInput, Space, Text, TextInput} from "@mantine/core";
import {Navigate, useNavigate} from "react-router";
import Cookies from "universal-cookie";
import { notifications } from '@mantine/notifications';
import {geoDistance, loadState, removeState, saveState} from "./utils/utils";

const MainMap = () => {
    const [dangerPosCircle, setDangerPosCircle] = useState(undefined)

    const [radiusText, setRadiusText] = useState(0)
    const [isAddCircle, setIsAddCircle] = useState(false)

    const cookies = new Cookies()
    const markRef = useRef(undefined)
    const circleRef = useRef(undefined)
    const navigate = useNavigate()

    const getActualPosition = async () => {
        let positionDevice = await axios.get(AuthRoutes.URL +
            `api/plugins/telemetry/DEVICE/${cookies.get("devId") || loadState('devId')}/values/timeseries?keys=latitude,longitude&startTs=1685951580000&endTs=${new Date().getTime()}&limit=1`,
            {
                "headers": {
                    "Content-Type": "application/json",
                    "X-Authorization": `Bearer ${cookies.get("devToken") || loadState('devToken')}`
                }
            }
        ).then(r => r.data).catch(err => "Err load data")

        let posLat = positionDevice?.latitude?.at(0)?.value
        let posLong = positionDevice?.longitude?.at(0)?.value

        if (posLong && posLat) {
            if (markRef.current){
                markRef.current?.geometry?.setCoordinates([posLat, posLong])
            }

            if (circleRef.current) {
                let circle = circleRef.current?.geometry
                let coords = geoDistance(posLat, posLong, ...circle?.getCoordinates())
                let radius = circle.getRadius()

                if ((radius - coords) <= 0) {
                    notifications.show({
                        withCloseButton: true,
                        autoClose: 5000,
                        title: "Внимание!",
                        message: 'Пользователь покинул разрешенную зону',
                        loading: false,
                        color: 'red',
                    })
                    if (loadState('telegramID')) {
                        await axios.get(AuthRoutes.TELEGRAM_SEND_MESSAGE + `?chat_id=${loadState('telegramID')}&text=Пользователь покинул разрешенную зону. Его текущая позиция (lat: ${posLat}, long: ${posLong})`).then(r => r.data).catch(err => {
                            notifications.show({
                                withCloseButton: true,
                                autoClose: 5000,
                                title: "Ошибка!",
                                message: 'Отправка сообщения не удалась',
                                loading: false,
                                color: 'red',
                            })
                        })
                    }
                }
            }
            return [posLat, posLong]
        } else {
            notifications.show({
                withCloseButton: true,
                autoClose: 5000,
                title: "Ошибка!",
                message: 'Невозможно получить данные',
                loading: false,
                color: 'red',
            })
            removeState('isLogin')
            removeState('devId')
            removeState('devToken')

            window.location.reload();
        }
    }

    const setTelegramId = (id) => {
        if (id) {
            saveState('telegramID', id)
        } else {
            removeState('telegramID')
        }
    }

    useEffect(() => {
        if ((cookies.get("devToken") && cookies.get("devId") && cookies.get("isLogin")) ||
            (loadState('devToken') && loadState('devId') && loadState('isLogin'))) {
            getActualPosition().then(r => console.log(r))
            setInterval(() => {
                getActualPosition().then(r => console.log(r))
            }, 15000)
        }
    }, []);


    if (cookies.get("isLogin") || loadState('isLogin')) {
        return (
            <div className="App">
                <YMaps>
                    <Map
                        defaultState={{
                            center: [54.71974, 55.931184],
                            zoom: 15,
                            controls: ["zoomControl", "fullscreenControl"],
                        }}
                        modules={["control.ZoomControl", "control.FullscreenControl"]}
                        width={'70vw'}
                        height={'100vh'}
                        onClick={(e) => isAddCircle && setDangerPosCircle(e.get('coords'))}
                    >
                        <Placemark
                            instanceRef={markRef}
                            defaultGeometry={[54.71974, 55.931184]}
                        />
                        {
                            isAddCircle &&
                            <Circle
                                geometry={[dangerPosCircle, Number(radiusText)]}
                                instanceRef={circleRef}
                                options={{
                                    draggable: false,
                                    fillColor: "#DB709300",
                                    strokeColor: "#FF0000",
                                    strokeOpacity: 0.8,
                                    strokeWidth: 5,
                                }}
                            />
                        }
                    </Map>
                </YMaps>
                <Flex
                    mih={50}
                    bg="#B4AED660"
                    justify="space-between"
                    align="center"
                    direction="column"
                    wrap="nowrap"
                    h="100vh"
                    w="30vw"
                >
                    <Container />
                    <Container>
                        <NumberInput
                            variant="filled"
                            label="Граница"
                            description="Позволяет задать зону, за пределы которой запрещено выходить"
                            placeholder="Радиус"
                            radius="md"
                            size="md"
                            onChange={setRadiusText}
                        />
                        <Space h="md"/>
                        <Button
                            color={isAddCircle ? "red" : "indigo"}
                            radius="md"
                            size="md"
                            onClick={() => radiusText && setIsAddCircle(!isAddCircle)}
                        >
                            {isAddCircle ? "Удалить" : "Добавить"}
                        </Button>
                        <Space h="xl" />
                        <TextInput
                            defaultValue={loadState('telegramID') || ""}
                            variant="filled"
                            label="Телеграм ID"
                            description="Сообщения о событиях будут автоматически отправляться в личные сообщения"
                            placeholder="ID профиля"
                            radius="md"
                            size="md"
                            onChange={(text) => setTelegramId(text.target.value)}
                        />
                    </Container>
                    <Container>
                        <Text fz="xs">Создал С.Осипов</Text>
                    </Container>
                </Flex>
            </div>
        );
    } else {
        return <Navigate to="/login" replace/>
    }
};

export default MainMap;
