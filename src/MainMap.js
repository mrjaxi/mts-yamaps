import React, {useEffect, useRef, useState} from 'react';
import './styles/App.css';
import axios from "axios";
import AuthRoutes from "./AuthRoutes";
import {Circle, Map, Placemark, YMaps} from "@pbe/react-yandex-maps";
import {Button, Container, Flex, NumberInput, Space, Text} from "@mantine/core";
import {Navigate} from "react-router";
import Cookies from "universal-cookie";
import { notifications } from '@mantine/notifications';

const MainMap = () => {
    const [dangerPosCircle, setDangerPosCircle] = useState(undefined)

    const [radiusText, setRadiusText] = useState(100)
    const [isAddCircle, setIsAddCircle] = useState(false)

    const cookies = new Cookies()
    const markRef = useRef(undefined)
    const circleRef = useRef(undefined)

    const getActualPosition = async () => {
        let positionDevice = await axios.get(AuthRoutes.URL +
            `api/plugins/telemetry/DEVICE/${cookies.get("devId")}/values/timeseries?keys=latitude,longitude&startTs=1685951580000&endTs=${new Date().getTime()}&limit=1`,
            {
                "headers": {
                    "Content-Type": "application/json",
                    "X-Authorization": `Bearer ${cookies.get("devToken")}`
                }
            }
        ).then(r => r.data)

        let posLat = positionDevice.latitude[0].value
        let posLong = positionDevice.longitude[0].value

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
            }
        }

        return [posLat, posLong]
    }

    function geoDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3, pi = Math.PI;
        const { sin, cos, atan2 } = Math;
        
        const fi1 = lat1 * pi / 180, lamda1 = lon1 * pi / 180;
        const fi2 = lat2 * pi / 180, lamda2 = lon2 * pi / 180;
        const deltaFi = fi2 - fi1, deltaLamda = lamda2 - lamda1;

        const a = sin(deltaFi/2)**2 + cos(fi1) * cos(fi2) * sin(deltaLamda/2)**2;
        const c = 2 * atan2(a**.5, (1-a)**.5);
        const d = R * c;

        return d;
    }

    useEffect(() => {
        if (cookies.get("devToken") && cookies.get("devId") && cookies.get("isLogin")) {
            // getActualPosition().then(r => console.log(r))
            setInterval(() => {
                 getActualPosition().then(r => console.log(r))
            }, 7000)
        }
    }, []);


    if (cookies.get("isLogin")) {
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
                            defaultValue={100}
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