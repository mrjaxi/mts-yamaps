import '../styles/App.css';
import React, {useEffect, useState} from 'react';
import {
    Button,
    Center,
    Container,
    Flex,
    Image,
    Loader,
    PasswordInput,
    Space,
    Text,
    TextInput,
    Title
} from "@mantine/core";
import {useNavigate} from "react-router";
import ImageLogo from '../assets/img-icon.png'
import {loginRequest} from "../api/loginRequest";
import {loadState, saveState} from "../utils/localStorage";

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const auth = async () => {
        setIsLoading(true)
        if (loadState('devToken') && loadState('devId')) {
            navigate("/devices", {replace: true})
        } else {
            let tokenDevice = await loginRequest(email, password)

            setIsLoading(false)
            if (tokenDevice) {
                saveState('devToken', tokenDevice)
                saveState('isLogin', true)

                navigate("/devices", { replace: true })
            } else {
                setError(true)
            }
        }
    }

    // useEffect(() => {auth()}, [])


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
                        <Title>УУНиТ ГеоПозиция</Title>
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
};

export default LoginPage;
