import React, {useEffect, useState} from 'react';
import '../styles/App.css';
import {
    Accordion,
    Badge,
    Button,
    Container, Divider,
    Flex,
    List,
    Loader,
    Space,
    Title
} from "@mantine/core";
import axios from "axios";
import AuthRoutes from "../api/AuthRoutes";
import {loadState, removeState, saveState} from "../utils/notificationSender";
import Cookies from "universal-cookie";
import {useNavigate} from "react-router";

const DevicesPage = () => {

    const [devices, setDevices] = useState([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
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
        ).then(r => r.data.data).catch(err => false) //.data[0].id.id

        if (idDevice){
            setDevices(idDevice)
            setLoading(false)
        } else {
            removeState('devToken')
            removeState('isLogin')
            navigate("/login", {replace: true})
        }
    }

    const chooseDevice = (idDevice) => {
        cookies.set("devId", idDevice)
        saveState('devId', idDevice)

        navigate("/main", {replace: true})
    }

    useEffect(() => {
        if ((cookies.get("devToken") && cookies.get("isLogin")) || (loadState('devToken') && loadState('isLogin'))) {
            getInfoByDevice()
        } else {
            removeState('devToken')
            removeState('isLogin')
            navigate("/login", {replace: true})
        }
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
                    <Container>
                        <Title>Доступные устройства</Title>
                        <Space h="xl"/>
                        <Accordion w="35vw" variant="separated" radius="md" chevronPosition="left" defaultValue="customization">
                        {
                            devices.map(device => (
                                <Accordion.Item key={device.id.id} value={device.name}>
                                    <Accordion.Control>
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                        >
                                            {device.name}
                                            <Badge color={device.gateway ? "green" : "red"} size="lg">{device.gateway ? "Работает" : "Выключен"}</Badge>
                                        </Flex>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <List withPadding>
                                            <List.Item>{device.customerTitle}</List.Item>
                                            <List.Item>{device.type}</List.Item>
                                            <List.Item>Дата создания: {new Date(device.createdTime).toLocaleDateString("ru-RU")}</List.Item>
                                        </List>
                                        <Space h="xl"/>
                                        <Divider my="sm" />
                                        <Button onClick={() => chooseDevice(device.id.id)} w="100%" color="indigo" radius="md" size="md">
                                            Выбрать
                                        </Button>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))
                        }
                        </Accordion>
                    </Container>
            </Flex>
        );
    }
};

export default DevicesPage;
