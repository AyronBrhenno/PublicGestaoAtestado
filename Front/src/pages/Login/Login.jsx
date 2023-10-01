import { useState } from 'react';
import './Login.css';
import {
    Container,
    Card,
    Row,
    Col,
    Form,
    Button
} from "react-bootstrap";
//import { useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { Toast } from 'react-bootstrap';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    const {
        //control,
        handleSubmit,
        //setError,
        register,
        //setValue,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
        handleLogin()
    };
    const handleLogout = () => {
        AuthService.logout(); // Faz a chamada ao serviço de logout
        navigate("/"); // Redireciona o usuário para a página de login após o logout
    };
    const handleLogin = async () => {
        try {
            await AuthService.login(username, password, selectedOption); // Faz a chamada ao serviço de login
            navigate(DefinirHref()); // Navega para a página de dashboard após o login
        } catch (error) {
            setError(error.message);
            setMessage("Senha ou Matrícula incorreta")
            setShowSuccessModal(true);
        }
    };
    const OkMensagemModal = ({ data, status }) => {
        const [show, setShow] = useState(status);
        setTimeout(() => {
            setShow(false)
        }, 5000);
        return (
            <Container className='d-flex align-items-center justify-content-center mb-4'>
                <Toast show={show} autohide={false}>
                    <Toast.Body>
                        {data}
                    </Toast.Body>
                </Toast>
            </Container>
        );
    };
    const [selectedOption, setSelectedOption] = useState(''); // Estado para rastrear a opção selecionada
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value); // Atualiza o estado quando a opção muda
    };
    const DefinirHref = () => {
        if (selectedOption === "Medico") {
            return '/medico/dashboard'
        } if (selectedOption === "Gestor") {
            return '/gestor/dashboard'
        } else {
            return '/'
        }
    }
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
                                Seja Bem Vindo
                            </Card.Text>
                            <Card.Text id='dica'>
                                Efetue o login para acessar todas as funcionalidades do site
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    {showSuccessModal && (
                        <OkMensagemModal data={message} status={true} />
                    )}
                    <Card id='card1'>
                        <Card.Body>
                            <Card.Title> <Row> <Col>Login </Col> <Col id='col1'><a href='/'>Voltar</a></Col></Row> </Card.Title>
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
                                        onChange={(e) => { setUsername(e.target.value) }}
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
                                    <Form.Label htmlFor="senha">Senha</Form.Label>
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
                                        onChange={(e) => { setPassword(e.target.value) }}

                                    />
                                    {errors.senha && (
                                        <Form.Control.Feedback type="invalid">
                                            {errors.senha.message}
                                        </Form.Control.Feedback>
                                    )}
                                </Form.Group>
                                <Button variant="primary" type="submit" className='mt-3' id='button-submit' >
                                    Entrar
                                </Button>
                            </Form>
                            <br />
                            <a href='/mudarSenha'>Esqueceu sua senha?</a>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;