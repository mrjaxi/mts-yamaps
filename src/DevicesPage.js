import React, {useEffect, useState} from 'react';
import './styles/App.css';
import {Badge, Button, Container, Flex, Group, Loader, Text} from "@mantine/core";
import axios from "axios";
import AuthRoutes from "./AuthRoutes";
import {loadState, saveState} from "./utils/utils";
import Cookies from "universal-cookie";

const DevicesPage = () => {

    const [devices, setDevices] = useState([])
    const [loading, setLoading] = useState(false)

    const cookies = new Cookies()

    const getInfoByDevice = async () => {
        setLoading(true)
        let idDevice = await axios.get(AuthRoutes.URL + AuthRoutes.GET_CUSTOMER_DEVICES + "?pageSize=10&page=0",
            {
                "headers": {
                    "Content-Type": "application/json",
                    "X-Authorization": `Bearer ${loadState('devToken')}`
                }
            }
        ).then(r => r.data.data).catch(err => "err") //.data[0].id.id
        setDevices(idDevice)
        console.log(idDevice)
        // cookies.set("devId", idDevice)
        // cookies.set("devName",)
        // saveState('devId', idDevice)
        // saveState('devName', )
        setLoading(false)
    }

    useEffect(() => {
        getInfoByDevice().then(r => console.log(r))
    }, []);


    if (loading) {
        return (
            <Flex
                mih={100}
                bg="#B4AED660"
                justify="center"
                align="center"
                direction="column"
                wrap="nowrap"
                h="100vh"
                w="100vw"
            >
                <Loader color="indigo" size="xl" variant="bars" />
            </Flex>
        )
    } else {
        return (
            <Flex
                mih={100}
                bg="#B4AED660"
                justify="center"
                align="center"
                direction="column"
                wrap="nowrap"
                h="100vh"
                w="100vw"
            >
                    <Flex
                        // key={device.createdTime}
                        justify="center"
                        align="center"
                        direction="column"
                    >
                    {
                        devices.map(device => (
                                <Container
                                    p={10}
                                    bg="#FFF"
                                >
                                    <Group position="apart" mt="md" mb="xs">
                                        <Text weight={500}>{device.name}</Text>
                                        <Badge color={device.gateway ? "green" : "red"} size="lg">{device.gateway ? "Работает" : "Выключен"}</Badge>
                                    </Group>

                                    <Text size="sm" color="dimmed">
                                       DeviceID: {device.id.id}
                                    </Text>
                                </Container>
                        ))
                    }
                    </Flex>
            </Flex>
        );
    }
};

export default DevicesPage;
