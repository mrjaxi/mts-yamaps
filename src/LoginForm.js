import './styles/App.css';
import React, {useEffect, useState} from 'react';
import {Button, Center, Container, Flex, Image, PasswordInput, Space, Text, TextInput, Title} from "@mantine/core";
import axios from "axios";
import AuthRoutes from "./AuthRoutes";
import {Navigate, useNavigate} from "react-router";
import Cookies from "universal-cookie";
import ImageLogo from './img/img-icon.png'

const LoginForm = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()
    const cookies = new Cookies()

    const auth = async () => {
        setIsLoading(true)
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
        console.log(idDevice)

        setIsLoading(false)
        if (!error && tokenDevice && idDevice) {
            cookies.set("devToken", tokenDevice)
            cookies.set("devId", idDevice)
            cookies.set("isLogin", true)

            navigate("/main", { replace: true })
        }
    }


    if (cookies.get("devToken") && cookies.get("devId")) {
        return <Navigate to="/main" replace />
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
                <Container miw="22vw">
                    <Flex
                        justify="center"
                        align="center"
                        direction="column"
                    >
                        <Center>
                            <Image maw={50} mx="auto" radius="xl" src={ImageLogo} alt="Random image" />
                            <Space w="md"/>
                            <Title>МТС ГеоПозиция</Title>
                        </Center>
                        <Container>
                            <Text fz="xs">Создал С.Осипов</Text>
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
                        <Button
                            onClick={() => email && password && auth().then()}
                            color="indigo"
                            radius="md"
                            w="100%"
                            loading={isLoading}
                        >
                            Войти
                        </Button>
                    </Flex>
                </Container>
            </Flex>
        );
    }
};

export default LoginForm;