import './MedicoDashboard.css'
import {
    Container,
    Nav,
    Navbar,
    Button,
    Row,
    Col,
    Card,
    Modal
} from "react-bootstrap";
import ButtonMui from '@mui/material/Button';
import { useState, useEffect } from 'react';
import PieChart from '../../components/PieChartMedico';
import BarChart from '../../components/BarChartMedico';
import * as React from 'react';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton } from '@mui/x-data-grid';
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'


function MedicoDashboard() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const handleLogout = () => {
        AuthService.logout(); // Faz a chamada ao serviço de logout
        navigate('/'); // Redireciona o usuário para a página de login após o logout
    };
    const fetchData = async () => {
        // Substitua isso pela lógica de busca de dados real
        const token = localStorage.getItem('token'); // Replace with your actual token
        const jsonData = {
            coluna: 'medicoFK',
            dado: localStorage.getItem('rg')
        };
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json', // Adjust the content type if needed
            },
        };

        // Fetch data using Axios
        await axios.post('http://localhost:8080/atestado/medico/getonly', jsonData, config)
            .then(response => {
                const formattedItems = response.data.map(item => ({
                    id: item.atestado.id,
                    paciente: item.pacienteFK.nome,
                    cid: item.atestado.cid,
                    dataConsulta: item.atestado.dataConsulta,
                    horaInicioConsulta: item.atestado.horaInicioConsulta,
                    horaFimConsulta: item.atestado.horaFimConsulta,
                    dispensaAlgorismo: item.atestado.dispensaAlgorismo,
                    dispensaExtenso: item.atestado.dispensaExtenso
                }));
                setItems(formattedItems);
                setLoading(false)
            })
            .catch(error => {
                console.error('Erro ao buscar atestado:', error);
                setLoading(false);
            })
    };
    const InativarConf = (Pessoa) => {
        const [show, setShow] = useState(false);
        const text = `${Pessoa.Pessoa}`
        const handleClose = async () => { setShow(false) };
        const handleShow = () => setShow(true);
        // Simule uma atualização de dados quando um novo valor é recebido
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
            await axios.delete(`http://localhost:8080/atestado/medico/${text}`, config)
                .then(response => {
                    alert(response.data)
                    setShow(false)
                    fetchData()
                })
                .catch(error => {
                    console.error('Erro ao buscar atestado:', error);
                    setShow(false)
                })
        };
        return (
            <>
                <ButtonMui
                    variant="contained"
                    onClick={handleShow}
                    size='small'
                    startIcon={<FontAwesomeIcon icon={icon({ name: 'trash-can', style: 'regular' })} />}
                >
                    Inativar
                </ButtonMui>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Apagar atestado</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Realmente deseja deletar atestado de id {text}?
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

    const TableData = () => {
        const navigate = useNavigate();
        const columns = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'paciente', headerName: 'Paciente', width: 130 },
            { field: 'cid', headerName: 'CID', width: 90 },
            {
                field: 'dataConsulta',
                headerName: 'Data da Consulta',
                width: 130,
            },
            {
                field: 'horaInicioConsulta',
                headerName: 'Inicio Consulta',
                width: 110,
            },
            {
                field: 'horaFimConsulta',
                headerName: 'Fim Consulta',
                width: 100,
            },
            {
                field: 'dispensaAlgorismo',
                headerName: 'Dispensa Alg',
                width: 100
            },
            {
                field: 'dispensaExtenso',
                headerName: 'Dispensa Ext',
                width: 100
            },
            {
                field: 'view',
                headerName: 'Visualizar',
                width: 140,
                sortable: false,
                filterable: false,
                renderCell: (params) => (
                    <strong>
                        <ButtonMui
                            variant="contained"
                            size="small"
                            onClick={() => { navigate(`/medico/emitiratestado/ver/${params.row.id}`) }}
                            startIcon={<FontAwesomeIcon icon={icon({ name: 'eye', style: 'regular' })} />}
                        >
                            Visualizar
                        </ButtonMui>
                    </strong>
                ),
            },
            {
                field: 'inativar',
                headerName: 'Inativar',
                sortable: false,
                filterable: false,
                width: 120,
                renderCell: (params) => (
                    <strong>
                        <InativarConf Pessoa={`${params.row.id}`} />
                    </strong>
                ),
            },

        ];

        const rows = [{ "id": 1, "paciente": "Patric", "cid": "I682", "dataConsulta": "7/28/2005", "horaInicioConsulta": "6:52 PM", "dispensaAlgorismo": 0, "dispensaExtenso": "one", "horaFimConsulta": "3:42:39", "inativeAt": "9/24/2022" },
        { "id": 2, "paciente": "Torry", "cid": "W6112XS", "dataConsulta": "7/28/2005", "horaInicioConsulta": "4:53 PM", "dispensaAlgorismo": 0, "dispensaExtenso": "one", "horaFimConsulta": "0:27:02", "inativeAt": null },
        { "id": 3, "paciente": "Laureen", "cid": "M88812", "dataConsulta": "7/28/2005", "horaInicioConsulta": "9:44 PM", "dispensaAlgorismo": 0, "dispensaExtenso": "one", "horaFimConsulta": "21:12:34", "inativeAt": "11/6/2022" },
        { "id": 4, "paciente": "Zorana", "cid": "S52221K", "dataConsulta": "7/28/2005", "horaInicioConsulta": "6:06 PM", "dispensaAlgorismo": 0, "dispensaExtenso": "one", "horaFimConsulta": "15:58:23", "inativeAt": "7/13/2023" },
        { "id": 5, "paciente": "Bear", "cid": "T63614", "dataConsulta": "7/28/2005", "horaInicioConsulta": "9:56 PM", "dispensaAlgorismo": 1, "dispensaExtenso": "one", "horaFimConsulta": "13:52:45", "inativeAt": "7/1/2023" },
        { "id": 6, "paciente": "Augustine", "cid": "T23091A", "dataConsulta": "7/28/2005", "horaInicioConsulta": "10:08 PM", "dispensaAlgorismo": 0, "dispensaExtenso": "one", "horaFimConsulta": "1:40:48", "inativeAt": "9/2/2023" },
        { "id": 7, "paciente": "Maryanne", "cid": "S30867", "dataConsulta": "7/28/2005", "horaInicioConsulta": "9:06 AM", "dispensaAlgorismo": 1, "dispensaExtenso": "one", "horaFimConsulta": "5:31:51", "inativeAt": "9/18/2022" },
        { "id": 8, "paciente": "Corey", "cid": "V0409XA", "dataConsulta": "7/28/2005", "horaInicioConsulta": "4:55 PM", "dispensaAlgorismo": 0, "dispensaExtenso": "one", "horaFimConsulta": "12:58:22", "inativeAt": "11/26/2022" },
        { "id": 9, "paciente": "Inesita", "cid": "M89239", "dataConsulta": "7/28/2005", "horaInicioConsulta": "11:42 PM", "dispensaAlgorismo": 1, "dispensaExtenso": "one", "horaFimConsulta": "19:09:39", "inativeAt": "10/27/2022" },
        { "id": 10, "paciente": "Leo", "cid": "S31041A", "dataConsulta": "7/28/2005", "horaInicioConsulta": "5:41 PM", "dispensaAlgorismo": 0, "dispensaExtenso": "one", "horaFimConsulta": "13:53:31", "inativeAt": "1/11/2023" }]

        return { columns: columns, rows: rows }
    }
    const CustomGridToolbar = () => {
        return (
            <GridToolbarContainer >
                <div className="custom-toolbar">
                    <GridToolbarColumnsButton className="columsButton" />
                    <GridToolbarFilterButton className="filterButton" />
                    <GridToolbarDensitySelector className="densityButton" />
                </div>
            </GridToolbarContainer>

        );
    }
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
    }, []); // Add dependencies if needed

    useEffect(() => {
        // Simule uma atualização de dados quando um novo valor é recebido
        const fetchData = async () => {
            // Substitua isso pela lógica de busca de dados real
            const token = localStorage.getItem('token'); // Replace with your actual token
            const jsonData = {
                coluna: 'medicoFK',
                dado: localStorage.getItem('rg')
            };
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', // Adjust the content type if needed
                },
            };

            // Fetch data using Axios
            await axios.post('http://localhost:8080/atestado/medico/getonly', jsonData, config)
                .then(response => {
                    const formattedItems = response.data.map(item => ({
                        id: item.atestado.id,
                        paciente: item.pacienteFK.nome,
                        cid: item.atestado.cid,
                        dataConsulta: item.atestado.dataConsulta,
                        horaInicioConsulta: item.atestado.horaInicioConsulta,
                        horaFimConsulta: item.atestado.horaFimConsulta,
                        dispensaAlgorismo: item.atestado.dispensaAlgorismo,
                        dispensaExtenso: item.atestado.dispensaExtenso
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

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="light">
                <Container fluid className='' id='nav'>
                    <Navbar.Brand href="/">Gestão de Atestado</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <Nav.Item>
                                <Nav.Link id='nav-link1' onClick={() => { navigate('/medico/dasboard') }}>Dashboard</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link id='nav-link2' onClick={() => { navigate('/medico/emitiratestado') }}>Emitir Atestado</Nav.Link>
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
            <Container>
                <Row>
                    <Col id='Bar-chats'>
                        <Card>
                            <Card.Body>
                                <BarChart />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col >
                        <Card>
                            <Card.Title>
                                Cids mais emitidos
                            </Card.Title>
                            <Card.Body>
                                <div style={{ width: 400 }}>
                                    <PieChart />
                                </div>
                            </Card.Body>
                        </Card>

                    </Col>
                </Row>
            </Container>
            <br />
            <br />
            <Container>
                <Row>
                    <div style={{ height: 400, width: '100%' }}>
                        {loading ? (<CircularProgress size={80} style={{ margin: 'auto', display: 'block' }} />)
                            : (<DataGrid
                                getRowId={(row) => row.id}
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
export default MedicoDashboard;