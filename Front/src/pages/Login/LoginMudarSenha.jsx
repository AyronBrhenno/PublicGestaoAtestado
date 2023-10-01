import './Login.css';
import {
    Container,
    Card,
    Row,
    Col,
    Form,
    Button
} from "react-bootstrap";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
function Login() {
    const [senha, setSenha] = useState('');
    const [matricula, setMatricula] = useState('');
    const {
        //control,
        handleSubmit,
        //setError,
        register,
        //setValue,
        formState: { errors },
    } = useForm();
    const updateData = async () => {
        const token = localStorage.getItem('token');
        const jsonData = {
            senha: senha,
            rg: matricula
        }
        await axios.put(`http://localhost:8080${DefinirHref()}`, jsonData)
            .then(response => {
                const dd = response.data
                console.log(response)
                alert(dd.mensagem)
            })
            .catch(error => {
                console.error('Erro ao cadastrar atestado:', error);
                alert('erro ao trocar senha')
            })
    };
    const onSubmit = (data) => {
        console.log(data);
        updateData()
    };
    const [selectedOption, setSelectedOption] = useState(''); // Estado para rastrear a opção selecionada

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value); // Atualiza o estado quando a opção muda
    };
    const DefinirHref = () => {
        if (selectedOption === "Medico") {
            return `/medico/${matricula}`
        } if (selectedOption === "Gestor") {
            return `/gestor/${matricula}`
        } else {
            return '/'
        }
    }

    
    /*
    function mesmaSenha(senha, senhaCon){
        if(senha === senhaCon){
            return null
        }else{
            document.getElementById('label').innerHTML = 'erro';
            return null
        }
    } */
    return (
        <Container id='container-max' className="d-flex justify-content-center align-items-center h-100">
            <Row className='className="d-flex justify-content-center align-items-center vh-100'>
                <Col>
                    <Card id='card' className="">
                        <Card.Body>
                            <Card.Title id='card-title'>
                                Gestão de atestados
                            </Card.Title>
                            <Card.Text id='bemvindo'>
                                Mude sua senha
                            </Card.Text>
                            <Card.Text id='dica'>
                                Insira sua matricula e sua nova senha para mudar a senha
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card id='card1'>
                        <Card.Body>
                            <Card.Title> <Row> <Col>Mudar senha </Col> <Col id='col1'><a href='/'>Voltar</a></Col></Row> </Card.Title>
                            <Form noValidate
                                validated={!!errors}
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                {['radio'].map((type) => (
                                    <div key={`inline-${type}`} className="mb-3">
                                        <Form.Check
                                            inline
                                            label="Gestor"
                                            name="group1"
                                            value="Gestor"
                                            type={type}
                                            id={`inline-${type}-1`}
                                            checked={selectedOption === 'Gestor'}
                                            onChange={handleOptionChange}
                                        />
                                        <Form.Check
                                            inline
                                            label="Medico"
                                            value="Medico"
                                            name="group1"
                                            type={type}
                                            id={`inline-${type}-2`}
                                            checked={selectedOption === 'Medico'}
                                            onChange={handleOptionChange}
                                        />
                                    </div>
                                ))}
                                <Form.Group>
                                    <Form.Label htmlFor="matricula">Matricula</Form.Label>
                                    <Form.Control
                                        id='matricula'
                                        type="text"
                                        isInvalid={errors.matricula}
                                        placeholder='000.000.000-00'
                                        aria-describedby="matriculaHelpBlock"
                                        {...register("matricula", {
                                            required: {
                                                value: true,
                                                message: "Matricula é obrigatória",
                                            },
                                            pattern: {
                                                value: /\d{3}.\d{3}.\d{3}-\d{2}/,
                                                value: /\d{2}.\d{3}.\d{3}-\d{1}/,
                                                message: "RG/CPF incorreto",
                                            },
                                        })}
                                        onChange={(e) => setMatricula(e.target.value)}
                                    />
                                    <Form.Text id="matriculaHelpBlock" muted>
                                        Sua matricula é o seu CPF/RG
                                    </Form.Text>
                                    {errors.matricula && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.matricula.message}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                                <Form.Group>
                                    <br />
                                    <Form.Label htmlFor="senha">Nova senha</Form.Label>
                                    <Form.Control
                                        id='senha'
                                        isInvalid={errors.senha}
                                        placeholder='123'
                                        type="password"
                                        
                                        {...register("senha", {
                                            required: {
                                                value: true,
                                                message: "Senha é obrigatória",
                                            },
                                            minLength: {
                                                value: 5,
                                                message:
                                                    "A senha deve ter no mínimo 5 caracteres",
                                            },
                                        })}
                                        onChange={(e) => {
                                            setSenha(e.target.value)
                                        }}
                                    />
                                    {errors.senha && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.senha.message}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                                {/*
                                <Form.Group>
                                    <br />
                                    <Form.Label htmlFor="senhaCon">Confirmar senha</Form.Label>
                                    <Form.Control
                                        id='senhaCon'
                                        isInvalid={errors.senhaCon}
                                        placeholder='123'
                                        type="password"
                                        onChange={(e) => {
                                            setSenhaCon(e.target.value)
                                            mesmaSenha(senha, senhaCon)
                                        }}
                                        {...register("senhaCon", {
                                            required: {
                                                value: true,
                                                message: "A confirmação é obrigatória",
                                            },
                                            minLength: {
                                                value: 5,
                                                message:
                                                    "A senha deve ter no mínimo 5 caracteres",
                                            },
                                        })}
                                    />
                                    {errors.senhaCon && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.senhaCon.message}
                                        </Form.Control.Feedback>
                                    )} 
                                </Form.Group>
                                    */}
                                <Button variant="primary" type="submit" className='mt-3' id='button-submit'>
                                    Confirmar
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;