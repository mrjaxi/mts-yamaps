import React, {useEffect, useRef, useState} from 'react';
import '../styles/App.css';
import {Circle, Map, Placemark, YMaps} from "@pbe/react-yandex-maps";
import {Button, Container, Flex, NumberInput, Space, Text, TextInput} from "@mantine/core";
import {Navigate, useNavigate} from "react-router";
import {telemetryRequest} from "../api/telemetryRequest";
import {loadState, removeState, saveState} from "../utils/localStorage";
import {telegramRequest} from "../api/telegramRequest";
import {geoDistance} from "../utils/distanceCalc";
import {sendNotification} from "../utils/notificationSender";

const MainMap = () => {
    const [dangerPosCircle, setDangerPosCircle] = useState(undefined)

    const [radiusText, setRadiusText] = useState(0)
    const [isAddCircle, setIsAddCircle] = useState(false)
    const [isDanger, setIsDanger] = useState(false)

    const markRef = useRef(undefined)
    const circleRef = useRef(undefined)
    const inputRef = useRef(undefined)

    const navigate = useNavigate()

    const getActualPosition = async () => {
        if (loadState('devToken') && loadState('devId')) {
            let deviceData = await telemetryRequest(['latitude', 'longitude', 'aZ', 'aX'])
            // if (deviceData) {
            //     sendNotification("Ошибка!", "Невозможно получить данные")
            //     removeState('isLogin')
            //     removeState('devId')
            //     removeState('devToken')
            //
            //     navigate("/login", {replace: true});
            // }
            console.log(deviceData)
            let posLat = deviceData?.latitude?.at(0)?.value
            let posLong = deviceData?.longitude?.at(0)?.value
            let gainZ = deviceData?.aZ?.at(0).value
            let gainX = deviceData?.aX?.at(0).value

            console.log("z", gainZ, "  x", gainX)

            if (gainZ > 500 || Math.abs(gainX) > 50) {
                if (loadState('telegramID')) {
                    await telegramRequest(loadState('telegramID'), "Пользователь попал в критическую ситуацию.")
                }
            }

            if (posLong && posLat) {
                if (markRef.current) {
                    markRef.current?.geometry?.setCoordinates([posLat, posLong])
                }

                if (circleRef.current) {
                    let circle = circleRef.current?.geometry
                    let coords = geoDistance(posLat, posLong, ...circle?.getCoordinates())
                    let radius = circle.getRadius()

                    if ((radius - coords) <= 0) {
                        if (loadState('telegramID')) {
                            await telegramRequest(loadState('telegramID'), `Пользователь покинул разрешенную зону. Его текущая позиция (lat: ${posLat}, long: ${posLong})`)
                        }
                    }
                }
                return [posLat, posLong]
            }
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
        getActualPosition().then(r => console.log(r))
        setInterval(() => {
            getActualPosition().then(r => console.log(r))
        }, 5000)
    }, []);


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
                <Container>
                </Container>
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
                    <NumberInput
                        ref={inputRef}
                        variant="filled"
                        label="Усиление"
                        description="Параметр позволяет задать силу удара, при которой придет уведомление об опасности"
                        placeholder="Усиление"
                        radius="md"
                        size="md"
                        onChange={() => console.log(inputRef.current.defaultValue)}
                    />
                    <Space h="md"/>
                    <Button
                        color={isDanger ? "red" : "indigo"}
                        radius="md"
                        size="md"
                        onClick={() => radiusText && setIsDanger(!isDanger)}
                    >
                        {isDanger ? "Удалить" : "Отслеживать"}
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
};

export default MainMap;
