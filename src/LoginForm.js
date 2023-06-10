import './App.css';
import React, {useState} from 'react';
import {Button, Container, em, Flex, PasswordInput, Space, Text, TextInput, Title} from "@mantine/core";
import axios from "axios";
import AuthRoutes from "./AuthRoutes";
import {useNavigate} from "react-router";

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    const auth = async () => {
        console.log(email, password)
        let tokenDevice= await axios.post(AuthRoutes.URL + AuthRoutes.AUTH_PATH,
            {
                username: email,
                password: password
            }
        ).then(r => r.data.token).catch(err => setError(true))

        let idDevice = await axios.get(AuthRoutes.URL + AuthRoutes.GET_CUSTOMER_DEVICES + "?pageSize=10&page=0",
            {
                "headers": {
                    "Content-Type": "application/json",
                    "X-Authorization": `Bearer ${tokenDevice}`
                }
            }
        ).then(r => r.data.data[0].id.id).catch(err => setError(true))

        console.log(idDevice, tokenDevice)

        if (!error && tokenDevice && idDevice) {
            global.devToken = tokenDevice
            global.devId = idDevice
            global.isLogin = true

            navigate("/main", { replace: true })
        }
    }

    return (
        <Flex
            mih={50}
            bg="#B4AED650"
            justify="center"
            align="center"
            direction="column"
            wrap="nowrap"
            h="100vh"
            w="100vw"
        >
            <Container miw="22vw">
                <Flex
                    justify="center"
                    align="center"
                    direction="column"
                >
                    <Title>MTS Tracker</Title>
                    <Container>
                        <Text fz="xs">Created by C. Osipov</Text>
                    </Container>
                </Flex>
                <Space h="xl"/>
                <Flex
                    justify="center"
                    align="center"
                    direction="column"
                >
                <TextInput
                    placeholder="Эл. почта"
                    label="Эл. почта"
                    variant="filled"
                    radius="md"
                    size="md"
                    withAsterisk
                    w="100%"
                    onClick={() => setError(false)}
                    onChange={(email) => setEmail(email.target.value)}
                    error={error}
                />
                <Space h="md"/>
                <PasswordInput
                    placeholder="Пароль"
                    label="Пароль"
                    variant="filled"
                    radius="md"
                    size="md"
                    withAsterisk
                    w="100%"
                    onClick={() => setError(false)}
                    error={error && "Неправильно введены данные"}
                    onChange={(pass) => setPassword(pass.target.value)}
                />
                <Space h="xl"/>
                <Button onClick={() => email && auth().then()} color="indigo" radius="md">
                    Войти
                </Button>
                </Flex>
            </Container>
        </Flex>
    );
};

export default LoginForm;