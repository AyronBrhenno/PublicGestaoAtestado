import './GestorDashboard.css'
import {
    Container,
    Nav,
    Navbar,
    Button,
    Row,
    Col,
    Card
} from "react-bootstrap";
import ButtonMui from '@mui/material/Button';
import PieChart from '../../components/PieChartGestor';
import BarChart from '../../components/BarChartGestor';
import * as React from 'react';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton } from '@mui/x-data-grid';
import AuthService from "../../services/AuthService";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

function TableData() {
    const navigate = useNavigate();
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'paciente', headerName: 'Paciente', width: 130 },
        { field: 'medico', headerName: 'Medico', width: 130 },
        { field: 'crm', headerName: 'CRM', width: 130 },
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
                        onClick={() => { navigate(`/gestor/dashboard/atestado/ver/${params.row.id}`) }}
                        startIcon={<FontAwesomeIcon icon={icon({ name: 'eye', style: 'regular' })} />}
                    >
                        Visualizar
                    </ButtonMui>
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
function CustomGridToolbar() {

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
function GestorDashboard() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contMedicos, setContMedicos] = useState('carregando...');
    const [contPacientes, setContPacientes] = useState('carregando...');
    const navigate = useNavigate();
    const handleLogout = () => {
        AuthService.logout(); // Faz a chamada ao serviço de logout
        navigate('/'); // Redireciona o usuário para a página de login após o logout
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
            await axios.get('http://localhost:8080/atestado/gestor/getall', config)
                .then(response => {
                    const formattedItems = response.data.map(item => ({
                        id: item.atestado.id,
                        paciente: item.pacienteFK.nome,
                        cid: item.atestado.cid,
                        dataConsulta: item.atestado.dataConsulta,
                        horaInicioConsulta: item.atestado.horaInicioConsulta,
                        horaFimConsulta: item.atestado.horaFimConsulta,
                        dispensaAlgorismo: item.atestado.dispensaAlgorismo,
                        dispensaExtenso: item.atestado.dispensaExtenso,
                        medico: item.medicoFK.nome,
                        crm: item.medicoFK.crm
                    }));
                    setItems(formattedItems);
                    setLoading(false)
                })
                .catch(error => {
                    console.error('Erro ao buscar atestado:', error);
                    setLoading(false);
                });
            await axios.get('http://localhost:8080/atestado/gestor/contarmedicos')
                .then(response => {
                    setContMedicos(response.data);
                })
                .catch(error => {
                    console.error('Erro ao buscar atestado:', error);
                });
            await axios.get('http://localhost:8080/atestado/gestor/contarpacientes')
                .then(response => {
                    setContPacientes(response.data);
                })
                .catch(error => {
                    console.error('Erro ao buscar atestado:', error);
                });
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
                                <Nav.Link id='nav-link1' onClick={() => { navigate('/gestor/dashboard') }}>Dashboard</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link id='nav-link2' onClick={() => { navigate('/gestor/paciente') }}>Pacientes</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link id='nav-link2' onClick={() => { navigate('/gestor/medico') }}>Medicos</Nav.Link>
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
            <Container style={{ marginBottom: '10px' }}>
                <Row className="justify-content-md-between">
                    <Col sm={2} style={{ width: 'auto', height: 'auto' }} className="mb-3 mb-sm-0">
                        <Card id='texto' >
                            <Card.Body>
                                <Card.Title className="text-nowrap">Médicos <br /> Cadastrados</Card.Title>
                                <Card.Text className="h3">{contMedicos}</Card.Text>
                            </Card.Body>
                        </Card>
                        <br/>
                        <Card className="mb-3 mb-sm-0">
                            <Card.Body>
                                <Card.Title className="text-nowrap">Pacientes <br />  Cadastrados</Card.Title>
                                <Card.Text className="h3">{contPacientes}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={6} className="mb-3 mb-md-0">
                        <Card >
                            <Card.Body>
                                <Card.Title>Quantidade de atestados emitidos em cada mês de 2023</Card.Title>
                                <div style={{ width: 'auto' }}>
                                    <BarChart />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="mb-3 mb-md-0">
                        <Card>
                            <Card.Body>
                                <Card.Title>Cids mais emitidos</Card.Title>
                                <div style={{ width: '85%', margin: '0 auto' }}>
                                    <PieChart />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <br />
            <br />
            <Container style={{ marginBottom: '10px' }}>
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
export default GestorDashboard;