import './GestorMedico.css'
import {
    Container,
    Nav,
    Navbar,
    Button,
    Row,
    Col,
    Card,
    Modal,
    Form
} from "react-bootstrap";
import ButtonMui from '@mui/material/Button';
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import * as React from 'react';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton } from '@mui/x-data-grid';
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { Toast } from 'react-bootstrap';


function GestorMedico() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState();
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para controlar a exibição do modal de sucesso
    const navigate = useNavigate();
    const handleLogout = () => {
        AuthService.logout(); // Faz a chamada ao serviço de logout
        navigate('/'); // Redireciona o usuário para a página de login após o logout
    };
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
        await axios.get('https://gestaoatestadoback.onrender.com/medico/getall', config)
            .then(response => {
                const formattedItems = response.data.map(item => ({
                    id: item.id,
                    rg: item.rg,
                    nome: item.nome,
                    dataNascimento: item.dataNascimento,
                    genero: item.genero,
                    email: item.email,
                    endereco: item.endereco,
                    crm: item.crm
                }));
                setItems(formattedItems);
                setLoading(false)
            })
            .catch(error => {
                console.error('Erro ao buscar atestado:', error);
                setLoading(false);
            })
    };
    const CustomGridToolbar = () => {
        return (
            <GridToolbarContainer >
                <div className="custom-toolbar">
                    <GridToolbarColumnsButton className="columsButton" />
                    <GridToolbarFilterButton className="filterButton" />
                    <GridToolbarDensitySelector className="densityButton" />
                    <CreateModal />
                </div>
            </GridToolbarContainer>

        );
    }
    const CreateModal = () => {
        const [show, setShow] = useState(false);
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        const CreateData = async (Data) => {
            const token = localStorage.getItem('token');
            console.log(Data)
            const jsonData = {
                "rg": Data.RG,
                "nome": Data.nome,
                "dataNascimento": Data.dataNascimento,
                "genero": Data.genero,
                "email": Data.email,
                "crm": Data.crm,
                "endereco": Data.Endereco,
                "senha": Data.RG
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', // Adjust the content type if needed
                },
            };
            await axios.post(`https://gestaoatestadoback.onrender.com/medico/cadastro`, jsonData, config)
                .then(response => {
                    const dd = response.data
                    console.log(response)
                    setShow(false)
                    setMessage("Sucesso ao criar Médico")
                    setShowSuccessModal(true); // Mostrar o modal de sucesso quando a solicitação for bem-sucedida
                    fetchData()
                })
                .catch(error => {
                    console.error('Erro ao cadastrar atestado:', error);
                    setMessage("Erro ao cadastrar médico, cpf já cadastrado")
                    setShow(false)
                    setShowSuccessModal(true);
                })
        };
        const {
            //control,
            handleSubmit,
            //setError,
            register,
            //setValue,
            formState: { errors },
        } = useForm();
        const onSubmit = (data) => {
            console.log(data);
            CreateData(data)
        };
        return (
            <>
                <Button variant="primary" onClick={handleShow}>
                    Cadastrar medico
                </Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cadastrar novo medico</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container id='container-min' className="d-flex justify-content-center">
                            <Row>
                                <Col>
                                    <Card id='card1'>
                                        <Card.Body>
                                            <Form noValidate
                                                validated={!!errors}
                                                onSubmit={handleSubmit(onSubmit)}
                                            >
                                                <Form.Group>
                                                    <Form.Label htmlFor="RG">RG/CPF Medico</Form.Label>
                                                    <Form.Control
                                                        id='RG'
                                                        type="text"
                                                        isInvalid={errors.RG}
                                                        placeholder='000.000.000-00'
                                                        aria-describedby="RGHelpBlock"
                                                        {...register("RG", {
                                                            required: {
                                                                value: true,
                                                                message: "RG é obrigatório",
                                                            },
                                                            pattern: {
                                                                value: /\d{3}.\d{3}.\d{3}-\d{2}/,
                                                                value: /\d{2}.\d{3}.\d{3}-\d{1}/,
                                                                message: "RG/CPF incorreto",
                                                            },
                                                        })}
                                                    />
                                                    <Form.Text id="RGHelpBlock" muted>
                                                        RG/CPF do paciente
                                                    </Form.Text>
                                                    {errors.RG && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.RG.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Form.Group>
                                                    <br />
                                                    <Form.Label htmlFor="nome">Nome Paciente</Form.Label>
                                                    <Form.Control
                                                        id='nome'
                                                        isInvalid={errors.senha}
                                                        placeholder='pedro silva fiqueiredo'
                                                        type="text"
                                                        {...register("nome", {
                                                            required: {
                                                                value: true,
                                                                message: "Nome é obrigatório",
                                                            },
                                                        })}
                                                    />
                                                    {errors.nome && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.nome.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Form.Group>
                                                    <br />
                                                    <Form.Label htmlFor="dataNascimento">Data de nascimento</Form.Label>
                                                    <Form.Control
                                                        id='dataNascimento'
                                                        isInvalid={errors.dataNascimento}
                                                        type="Date"
                                                        {...register("dataNascimento", {
                                                            required: {
                                                                value: true,
                                                                message: "Data de nascimento é obrigatória",
                                                            },
                                                        })}
                                                    />
                                                    {errors.dataNascimento && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.dataNascimento.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Form.Group>
                                                    <br />
                                                    <Form.Label htmlFor="genero">Gênero</Form.Label>
                                                    <Form.Control
                                                        id='genero'
                                                        isInvalid={errors.genero}
                                                        type="text"
                                                        {...register("genero", {
                                                            required: {
                                                                value: true,
                                                                message: "Gênero é obrigatorio",
                                                            },
                                                        })}
                                                    />
                                                    {errors.genero && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.genero.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Form.Group>
                                                    <br />
                                                    <Form.Label htmlFor="email">Email</Form.Label>
                                                    <Form.Control
                                                        id='email'
                                                        isInvalid={errors.email}
                                                        type="text"
                                                        {...register("email", {
                                                            required: {
                                                                value: true,
                                                                message: "Email é obrigatorio",
                                                            },
                                                        })}
                                                    />
                                                    {errors.email && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.email.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Form.Group>
                                                    <br />
                                                    <Form.Label htmlFor="endereco">Endereço</Form.Label>
                                                    <Form.Control
                                                        id='Endereco'
                                                        isInvalid={errors.Endereco}
                                                        type="text"
                                                        {...register("Endereco", {
                                                            required: {
                                                                value: true,
                                                                message: "Endereço é obrigatorio",
                                                            },
                                                        })}
                                                    />
                                                    {errors.Endereco && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.Endereco.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Form.Group>
                                                    <br />
                                                    <Form.Label htmlFor="crm">CRM</Form.Label>
                                                    <Form.Control
                                                        id='crm'
                                                        isInvalid={errors.crm}
                                                        type="text"
                                                        {...register("crm", {
                                                            required: {
                                                                value: true,
                                                                message: "CRM é obrigatorio",
                                                            },
                                                        })}
                                                    />
                                                    {errors.crm && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.crm.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Button variant="primary" type="submit" className='mt-3' id='button-submit'>
                                                    Cadastrar
                                                </Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container >
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
    const InativarConf = (data) => {
        const [show, setShow] = useState(false);
        const id = `${data.id}`;
        const nome = `${data.nome}`;
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        const deleteData = async () => {
            // Substitua isso pela lógica de busca de dados real
            const token = localStorage.getItem('token'); // Replace with your actual token

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', // Adjust the content type if needed
                },
            };

            // Fetch data using Axios
            await axios.delete(`https://gestaoatestadoback.onrender.com/medico/${id}`, config)
                .then(response => {
                    setShow(false)
                    setMessage("Sucesso ao deletar")
                    setShowSuccessModal(true)
                    fetchData()
                })
                .catch(error => {
                    console.error('Erro ao apagar paciente:', error);
                    setShow(false)
                    setMessage("Erro ao cadastrar deletar")
                    setShowSuccessModal(true)

                })
        };
        return (
            <>
                <Button variant="primary" onClick={handleShow}>
                    Inativar
                </Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Apagar medico</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Realmente deseja deletar cadastro de {nome}?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={deleteData}>
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
    const UpdateModal = (data) => {
        const [show, setShow] = useState(false);
        const rg = `${data.rg}`;
        const nome = `${data.nome}`;
        const dataNascimento = `${data.dataNascimento}`
        const genero = `${data.genero}`
        const id = `${data.id}`
        const email = `${data.email}`
        const crm = `${data.crm}`
        const endereco = `${data.endereco}`
        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);
        const updateData = async (Data) => {
            const token = localStorage.getItem('token');
            console.log(Data)
            const jsonData = {
                "rg": Data.rg,
                "nome": Data.nome,
                "dataNascimento": Data.dataNascimento,
                "genero": Data.genero,
                "email": Data.email,
                "crm": Data.crm,
                "endereco": Data.endereco,
                senha: null
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', // Adjust the content type if needed
                },
            };
            await axios.put(`https://gestaoatestadoback.onrender.com/medico/${rg}`, jsonData, config)
                .then(response => {
                    const dd = response.data
                    console.log(response)
                    setShow(false)
                    setMessage(dd.mensagem)
                    setShowSuccessModal(true)
                    fetchData()
                })
                .catch(error => {
                    console.error('Erro ao cadastrar atestado:', error);
                    setShow(false)
                    setMessage("Erro ao atualizar cadastrar do médico")
                    setShowSuccessModal(true)
                })
        };
        const {
            //control,
            handleSubmit,
            //setError,
            register,
            //setValue,
            formState: { errors },
        } = useForm();
        const onSubmit = (data) => {
            console.log(data);
            updateData(data)
        };
        return (
            <>
                <Button variant="primary" onClick={handleShow}>
                    Editar
                </Button>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Atualizar medico {nome}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container id='container-min' className="d-flex justify-content-center">
                            <Row>
                                <Col>
                                    <Card id='card1'>
                                        <Card.Body>
                                            <Form noValidate
                                                validated={!!errors}
                                                onSubmit={handleSubmit(onSubmit)}
                                            >
                                                <Form.Group>
                                                    <Form.Label htmlFor="RG">RG/CPF Medico</Form.Label>
                                                    <Form.Control
                                                        id='RG'
                                                        type="text"
                                                        value={rg}
                                                        isInvalid={errors.RG}
                                                        placeholder='000.000.000-00'
                                                        aria-describedby="RGHelpBlock"
                                                        {...register("RG", {
                                                            required: {
                                                                value: true,
                                                                message: "RG é obrigatório",
                                                            },
                                                            pattern: {
                                                                value: /\d{3}.\d{3}.\d{3}-\d{2}/,
                                                                value: /\d{2}.\d{3}.\d{3}-\d{1}/,
                                                                message: "RG/CPF incorreto",
                                                            },
                                                        })}
                                                    />
                                                    <Form.Text id="RGHelpBlock" muted>
                                                        RG/CPF do paciente
                                                    </Form.Text>
                                                    {errors.RG && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.RG.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Form.Group>
                                                    <br />
                                                    <Form.Label htmlFor="nome">Nome Paciente</Form.Label>
                                                    <Form.Control
                                                        id='nome'
                                                        isInvalid={errors.senha}
                                                        defaultValue={nome}
                                                        placeholder='pedro silva fiqueiredo'
                                                        type="text"
                                                        {...register("nome", {
                                                            required: {
                                                                value: true,
                                                                message: "Nome é obrigatório",
                                                            },
                                                        })}
                                                    />
                                                    {errors.nome && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.nome.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Form.Group>
                                                    <br />
                                                    <Form.Label htmlFor="dataNascimento">Data de nascimento</Form.Label>
                                                    <Form.Control
                                                        id='dataNascimento'
                                                        isInvalid={errors.dataNascimento}
                                                        defaultValue={dataNascimento}
                                                        type="Date"
                                                        {...register("dataNascimento", {
                                                            required: {
                                                                value: true,
                                                                message: "Data de nascimento é obrigatória",
                                                            },
                                                        })}
                                                    />
                                                    {errors.dataNascimento && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.dataNascimento.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Form.Group>
                                                    <br />
                                                    <Form.Label htmlFor="genero">Gênero</Form.Label>
                                                    <Form.Control
                                                        id='genero'
                                                        isInvalid={errors.genero}
                                                        defaultValue={genero}
                                                        type="text"
                                                        {...register("genero", {
                                                            required: {
                                                                value: true,
                                                                message: "Gênero é obrigatorio",
                                                            },
                                                        })}
                                                    />
                                                    {errors.genero && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.genero.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Form.Group>
                                                    <br />
                                                    <Form.Label htmlFor="email">Email</Form.Label>
                                                    <Form.Control
                                                        id='email'
                                                        defaultValue={email}
                                                        isInvalid={errors.email}
                                                        type="text"
                                                        {...register("email", {
                                                            required: {
                                                                value: true,
                                                                message: "Email é obrigatorio",
                                                            },
                                                        })}
                                                    />
                                                    {errors.email && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.email.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Form.Group>
                                                    <br />
                                                    <Form.Label htmlFor="endereco">Endereço</Form.Label>
                                                    <Form.Control
                                                        id='endereco'
                                                        defaultValue={endereco}
                                                        isInvalid={errors.endereco}
                                                        type="text"
                                                        {...register("endereco", {
                                                            required: {
                                                                value: true,
                                                                message: "Endereço é obrigatorio",
                                                            },
                                                        })}
                                                    />
                                                    {errors.endereco && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.endereco.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Form.Group>
                                                    <br />
                                                    <Form.Label htmlFor="crm">CRM</Form.Label>
                                                    <Form.Control
                                                        id='crm'
                                                        defaultValue={crm}
                                                        isInvalid={errors.crm}
                                                        type="text"
                                                        {...register("crm", {
                                                            required: {
                                                                value: true,
                                                                message: "CRM é obrigatorio",
                                                            },
                                                        })}
                                                    />
                                                    {errors.crm && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors.crm.message}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Form.Group>
                                                <Button variant="primary" type="submit" className='mt-3' id='button-submit'>
                                                    Atualizar
                                                </Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container >
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
    const TableData = () => {
        const columns = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'rg', headerName: 'RG/CPF', width: 130 },
            { field: 'nome', headerName: 'Nome Completo', width: 130 },
            { field: 'email', headerName: 'Email', with: 100 },
            { field: 'endereco', headerName: 'Endereço', width: 100 },
            { field: 'crm', headerName: 'CRM', width: 80 },
            { field: 'dataNascimento', headerName: 'Data de Nascimento,', width: 100 },
            { field: 'genero', headerName: 'Gênero', width: 100 },
            {
                field: 'Editar',
                headerName: 'Editar',
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <strong>
                        <UpdateModal
                            rg={`${params.row.rg}`}
                            nome={`${params.row.nome}`}
                            dataNascimento={`${params.row.dataNascimento}`}
                            genero={`${params.row.genero}`}
                            id={`${params.row.id}`}
                            email={`${params.row.email}`}
                            endereco={`${params.row.endereco}`}
                            crm={`${params.row.crm}`}
                        />
                    </strong>
                ),
            },
            {
                field: 'inativar',
                headerName: 'Inativar/Ativar',
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <strong>
                        <InativarConf nome={`${params.row.nome}`} id={`${params.row.id}`} />
                    </strong>
                ),
            },

        ];

        const rows = [{ "id": 1, "rg": "000.000.000-00", "nome": "Sayre Sidden", "dataNascimento": "6/22/2005", "genero": "Female", "inativeAt": "9/24/2022" },
        { "id": 2, "rg": "000.000.000-00", "nome": "Glen Meake", "dataNascimento": "6/22/2005", "genero": "Female", "inativeAt": "9/24/2022" },
        { "id": 3, "rg": "000.000.000-00", "nome": "Andre Dodswell", "dataNascimento": "6/22/2005", "genero": "Male", "inativeAt": "9/24/2022" },
        { "id": 4, "rg": "000.000.000-00", "nome": "Shayna Simonelli", "dataNascimento": "6/22/2005", "genero": "Non-binary", "inativeAt": "9/24/2022" },
        { "id": 5, "rg": "000.000.000-00", "nome": "Wilek Granham", "dataNascimento": "6/22/2005", "genero": "Male", "inativeAt": null },
        { "id": 6, "rg": "000.000.000-00", "nome": "Chaunce Masarrat", "dataNascimento": "6/22/2005", "genero": "Non-binary", "inativeAt": null },
        { "id": 7, "rg": "000.000.000-00", "nome": "Godwin Glasner", "dataNascimento": "6/22/2005", "genero": "Male", "inativeAt": "9/24/2022" },
        { "id": 8, "rg": "000.000.000-00", "nome": "Carmelina Colston", "dataNascimento": "6/22/2005", "genero": "Female", "inativeAt": "9/24/2022" },
        { "id": 9, "rg": "000.000.000-00", "nome": "Sidoney Brettel", "dataNascimento": "6/22/2005", "genero": "Female", "inativeAt": null },
        { "id": 10, "rg": "000.000.000-00", "nome": "Price Bulstrode", "dataNascimento": "6/22/2005", "genero": "Male", "inativeAt": "9/24/2022" }]

        return { columns: columns, rows: rows }
    }
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
    useEffect(() => {
        // For example, you can listen for a button click event here
        // If some condition triggers the logout, you can call handleLogout() here
        // For simplicity, I'm using a button click event as an example
        const button = document.getElementById('Button-pequeno');
        button.addEventListener('click', handleLogout);

        // Clean up the event listener when the component unmounts
        return () => {
            button.removeEventListener('click', handleLogout);
        };
    }, []);
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
            await axios.get('https://gestaoatestadoback.onrender.com/medico/getall', config)
                .then(response => {
                    const formattedItems = response.data.map(item => ({
                        id: item.id,
                        rg: item.rg,
                        nome: item.nome,
                        dataNascimento: item.dataNascimento,
                        genero: item.genero,
                        email: item.email,
                        endereco: item.endereco,
                        crm: item.crm
                    }));
                    setItems(formattedItems);
                    setLoading(false)
                })
                .catch(error => {
                    console.error('Erro ao buscar atestado:', error);
                    setLoading(false);
                })
        };

        // Chame a função fetchData quando um novo valor é recebido
        fetchData();
    }, []);
    const tabledata = TableData();
    const columns = tabledata.columns;
    const rows = tabledata.rows;
    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="light">
                <Container fluid className='' id='nav'>
                    <Navbar.Brand href="/">Gestão de Atestado</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <Nav.Item>
                                <Nav.Link id='nav-link2' onClick={() => { navigate('/gestor/dashboard') }}>Dashboard</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link id='nav-link2' onClick={() => { navigate('/gestor/paciente') }}>Pacientes</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link id='nav-link1' onClick={() => { navigate('/gestor/medico') }}>Medicos</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Button id='Button-pequeno' variant="primary" className='mr-4' >Sair</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br />
            <br />
            {showSuccessModal && (
                <OkMensagemModal data={message} status={true} />
            )}
            <Container>
                <Row>
                    <div style={{ height: 400, width: '100%' }}>
                        {loading ? (<CircularProgress size={80} style={{ margin: 'auto', display: 'block' }} />)
                            :
                            (<DataGrid
                                rows={items}
                                columns={columns}
                                components={{
                                    Toolbar: CustomGridToolbar, // Substitui a barra de ferramentas padrão pelo seu componente personalizado
                                }}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 5 },
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
                                checkboxSelection={false}
                            />)}
                    </div>
                </Row>
            </Container>
        </>
    );
}
export default GestorMedico;