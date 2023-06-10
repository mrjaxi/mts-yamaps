import React, {useEffect, useState} from 'react';
import './App.css';
import axios from "axios";
import AuthRoutes from "./AuthRoutes";
import {Circle, Map, Placemark, YMaps} from "@pbe/react-yandex-maps";
import {Button, Container, Flex, NumberInput, Space, Text} from "@mantine/core";
import {Navigate} from "react-router";

const MainMap = () => {
    const [position, setPosition] = useState({lat: 54.71974, long: 55.931184})
    const [dangerPosCircle, setDangerPosCircle] = useState(undefined)

    const [radiusText, setRadiusText] = useState(100)
    const [isAddCircle, setIsAddCircle] = useState(false)

    const getActualPosition = async () => {
        let positionDevice = await axios.get(AuthRoutes.URL +
            `api/plugins/telemetry/DEVICE/${global.devId}/values/timeseries?keys=latitude,longitude&startTs=1685951580000&endTs=1686414756000&limit=1`,
            {
                "headers": {
                    "Content-Type": "application/json",
                    "X-Authorization": `Bearer ${global.devToken}`
                }
            }
        ).then(r => r.data)

        setPosition({"lat": positionDevice.latitude[0].value, "long": positionDevice.longitude[0].value})

        return positionDevice
    }

    useEffect(() => {
        if (global.devToken && global.devId && global.isLogin) {
            console.log("GET DATA")
            // getActualPosition().then(r => console.log(r))
            // setInterval(() => {
            //     getActualPosition().then(r => console.log(r))
            // }, 20000)
        }
    }, []);

    if (global.isLogin) {
        return (
            <div className="App">
                <YMaps>
                    <Map
                        defaultState={{
                            center: [position.lat, position.long],
                            zoom: 15,
                            controls: ["zoomControl", "fullscreenControl"],
                        }}
                        modules={["control.ZoomControl", "control.FullscreenControl"]}
                        width={'70vw'}
                        height={'100vh'}
                        onClick={(e) => isAddCircle && setDangerPosCircle(e.get('coords'))}
                    >
                        <Placemark defaultGeometry={[54.71974, 55.931184]} />
                        {
                            isAddCircle &&
                            <Circle
                                geometry={[dangerPosCircle, Number(radiusText)]}
                                options={{
                                    draggable: false,
                                    fillColor: "#DB709300",
                                    strokeColor: "#FF0000",
                                    strokeOpacity: 0.8,
                                    strokeWidth: 5,
                                }}
                                onChange={(e) => isAddCircle && e.get('coords')}
                            />
                        }
                    </Map>
                </YMaps>
                <Flex
                    mih={50}
                    bg="rgba(0, 0, 0, .1)"
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
                        <Text fz="xs">Created by C. Osipov</Text>
                    </Container>
                </Flex>
            </div>
        );
    } else {
        return <Navigate to="/login" replace/>
    }
};

export default MainMap;