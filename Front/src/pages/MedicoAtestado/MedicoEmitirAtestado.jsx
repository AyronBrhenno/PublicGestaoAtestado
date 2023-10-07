import './MedicoEmitirAtestado.css'
import {
    Container,
    Nav,
    Navbar,
    Button,
    Row,
    Col,
    Card,
    Form,
    Modal
} from "react-bootstrap";
import ButtonMui from '@mui/material/Button';
import * as React from 'react';
import { useForm } from "react-hook-form";
import AuthService from "../../services/AuthService";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios'
import { Toast } from 'react-bootstrap';
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

function ConfirmarInsert(Data, rg) {
    const [show, setShow] = useState(false);
    const handleClose = () => { setShow(false) };
    const handleShow = () => setShow(true);
    const [message, setMessage] = useState();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();
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
    const inputData = async () => {
        const token = localStorage.getItem('token');
        const jsonData = {
            "medicoFK": localStorage.getItem('rg'),
            "pacienteFK": Data.Data.RG,
            "dataConsulta": Data.Data.dataConsulta,
            "horaInicioConsulta": Data.Data.horaInicioConsulta,
            "horaFimConsulta": Data.Data.horaFimConsulta,
            "dispensaAlgorismo": Data.Data.dispensaAlgorismo,
            "dispensaExtenso": Data.Data.dispensaExtenso,
            "cid": Data.Data.cid
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json', // Adjust the content type if needed
            },
        };
        await axios.post(`http://localhost:8080/atestado/medico/cadastro`, jsonData, config)
            .then(response => {
                const dd = response.data
                setMessage("Sucesso ao cadastrar atesdado")
                setShowSuccessModal(true);
                navigate(`ver/${dd.nome.id}`)
                setShow(false)
            })
            .catch(error => {
                console.error('Erro ao cadastrar atestado:', error);
                setShow(false)
                setMessage("Erro ao cadastrar atestado")
                setShowSuccessModal(true);
            })
    }
    return (
        <>
            {showSuccessModal && (
                <OkMensagemModal data={message} status={true} />
            )}
            <Button variant="primary" type='submit' onClick={handleShow}>
                cadastrar
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar atestado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tem certeza que deseja cadastrar esse atestado?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={inputData}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

function MedicoEmitirAtestado() {
    const [Data, setData] = useState();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [message, setMessage] = useState();
    const [rg, setrg] = useState('037.552.111-90');
    const [nomePaciente, setNomePaciente] = useState('Alvaro')
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const handleLogout = () => {
        AuthService.logout(); // Faz a chamada ao serviço de logout
        navigate('/'); // Redireciona o usuário para a página de login após o logout
    };

    useEffect(() => {
        // Simule uma atualização de dados quando um novo valor é recebido
        const fetchData = async () => {
            // Substitua isso pela lógica de busca de dados real
            const token = localStorage.getItem('token'); // Replace with your actual token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', // Adjust the content type if needed
                },
            };

            // Fetch data using Axios
            await axios.get('http://localhost:8080/medico/paciente/getall', config)
                .then(response => {
                    const formattedItems = response.data.map(item => ({
                        id: item.id,
                        rg: item.rg,
                        nome: item.nome,
                        value: item.rg,
                        label: item.nome,
                    }));
                    setItems(formattedItems);
                })
                .catch(error => {
                    console.error('Erro ao buscar atestado:', error);
                })
        };

        // Chame a função fetchData quando um novo valor é recebido
        fetchData();
        console.log(items)

    }, []);
    const handleChange = async (selectedOption) => {
        await setrg(selectedOption.value);
        await setNomePaciente(selectedOption.order)
    }
    useEffect(() => {
        // For example, you can listen for a button click event here
        // If some condition triggers the logout, you can call handleLogout() here
        // For simplicity, I'm using a button click event as an example
        const button = document.getElementById('Button-pequeno');
        button.addEventListener('click', handleLogout);
        console.log(items)
        // Clean up the event listener when the component unmounts
        return () => {
            button.removeEventListener('click', handleLogout);
        };
    }, []);
    const {
        //control,
        handleSubmit,
        //setError,
        register,
        //setValue,
        formState: { errors },
    } = useForm();
    const onSubmit = async (data) => {
        data.RG = rg
        console.log(data, 'Data');
        await setData(data)
        return data; // Return the data object
    };

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="light">
                <Container fluid className='' id='nav'>
                    <Navbar.Brand href="/">Gestão de Atestado</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <Nav.Item>
                                <Nav.Link id='nav-link1-1' onClick={() => { navigate('/medico/dashboard') }}>Dashboard</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link id='nav-link2-2' onClick={() => { navigate('/medico/emitiratestado') }}>Emitir Atestado</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <ButtonMui
                            id='Button-pequeno'
                            variant="contained"
                            size='small'
                            startIcon={<FontAwesomeIcon icon={icon({ name: 'arrow-right-from-bracket' })} />}
                        >
                            Sair
                        </ButtonMui>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br />
            <Container id='container-max' className="d-flex justify-content-center vh-100">
                <Row>
                    <Col>
                        <Card id='card1'>
                            <Card.Body>
                                <Form.Group>
                                    <Form.Label htmlFor="RG">RG Paciente</Form.Label>
                                    <Select
                                        id='RG'
                                        options={items.map(opt => ({ value: opt.value, label: opt.value, order: opt.label }))} 
                                        placeholder='Selecione um paciente...'
                                        onChange={handleChange}
                                    />
                                    <Form.Text id="RGHelpBlock" muted>
                                        RG/CPF do paciente
                                    </Form.Text>
                                </Form.Group>

                                <Form noValidate
                                    validated={!!errors}
                                    onSubmit={handleSubmit(onSubmit)}
                                >

                                    <Form.Group>
                                        <Form.Label htmlFor="nome">Nome do paceinte</Form.Label>
                                        <Form.Control
                                            id='nome'
                                            type="text"
                                            isInvalid={errors.nome}
                                            placeholder='Nome completo'
                                            aria-describedby="RGHelpBlock"
                                            value={nomePaciente}
                                            {...register("nome", {
                                                required: {
                                                    value: true,
                                                    message: "Nome é obrigatório",
                                                },
                                            })}
                                        />
                                        <Form.Text id="RGHelpBlock" muted>
                                            Nome do paciente
                                        </Form.Text>
                                        {errors.nome && (
                                            <Form.Control.Feedback type="invalid">
                                                {errors.nome.message}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                    <Form.Group>
                                        <br />
                                        <Form.Label htmlFor="dataConsulta">Data da consulta</Form.Label>
                                        <Form.Control
                                            id='dataConsulta'
                                            isInvalid={errors.dataConsulta}
                                            type="Date"
                                            {...register("dataConsulta", {
                                                required: {
                                                    value: true,
                                                    message: "Data é obrigatória",
                                                },
                                            })}
                                        />
                                        {errors.dataConsulta && (
                                            <Form.Control.Feedback type="invalid">
                                                {errors.dataConsulta.message}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                    <Form.Group>
                                        <br />
                                        <Form.Label htmlFor="horaInicioConsulta">Hora do Início da consulta</Form.Label>
                                        <Form.Control
                                            id='horaInicioConsulta'
                                            isInvalid={errors.senha}
                                            type="time"
                                            {...register("horaInicioConsulta", {
                                                required: {
                                                    value: true,
                                                    message: "A Hora é obrigatória",
                                                },
                                            })}
                                        />
                                        {errors.horaInicioConsulta && (
                                            <Form.Control.Feedback type="invalid">
                                                {errors.horaInicioConsulta.message}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                    <Form.Group>
                                        <br />
                                        <Form.Label htmlFor="horaFimConsulta">Hora do fim da consulta</Form.Label>
                                        <Form.Control
                                            id='horaFimConsulta'
                                            isInvalid={errors.senha}
                                            type="time"
                                            {...register("horaFimConsulta", {
                                                required: {
                                                    value: true,
                                                    message: "A Hora é obrigatória",
                                                },
                                            })}
                                        />
                                        {errors.horaFimConsulta && (
                                            <Form.Control.Feedback type="invalid">
                                                {errors.horaFimConsulta.message}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                    <Form.Group>
                                        <br />
                                        <Form.Label htmlFor="dispensaAlgorismo">Dias de dispensa em algarismo</Form.Label>
                                        <Form.Control
                                            id='dispensaAlgorismo'
                                            isInvalid={errors.dispensaAlgorismo}
                                            type="text"
                                            {...register("dispensaAlgorismo", {
                                                required: {
                                                    value: true,
                                                    message: "A dispesa em algarismo é obrigatória",
                                                },
                                            })}
                                        />
                                        {errors.dispensaAlgorismo && (
                                            <Form.Control.Feedback type="invalid">
                                                {errors.dispensaAlgorismo.message}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                    <Form.Group>
                                        <br />
                                        <Form.Label htmlFor="dispensaExtenso">Dias de dispensa por extenso</Form.Label>
                                        <Form.Control
                                            id='dispensaExtenso'
                                            isInvalid={errors.dispensaExtenso}
                                            type="text"
                                            {...register("dispensaExtenso", {
                                                required: {
                                                    value: true,
                                                    message: "A dispesa por extenso é obrigatória",
                                                },
                                            })}
                                        />
                                        {errors.dispensaExtenso && (
                                            <Form.Control.Feedback type="invalid">
                                                {errors.dispensaExtenso.message}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                    <Form.Group>
                                        <br />
                                        <Form.Label htmlFor="cid">CID</Form.Label>
                                        <Form.Control
                                            id='cid'
                                            isInvalid={errors.cid}
                                            type="text"
                                            {...register("cid", {
                                            })}
                                        />
                                        {errors.cid && (
                                            <Form.Control.Feedback type="invalid">
                                                {errors.cid.message}
                                            </Form.Control.Feedback>
                                        )}
                                    </Form.Group>
                                    <br />
                                    <ConfirmarInsert Data={Data} />
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container >
        </>
    );
}
export default MedicoEmitirAtestado;
