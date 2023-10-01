import React, { Component, useRef } from 'react';
import {
    Container,
    Nav,
    Navbar,
    Button,
    Row,
    Col,
    Card,
    Form
} from "react-bootstrap";
import AuthService from "../../services/AuthService";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
class MedicoEmitirAtestadoVer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: ['aa'],
            loading: true,
        };
    }

    componentDidMount() {
        const { id } = this.props;
        this.fetchData(id);
    }

    handleLogout = () => {
        const navigate = useNavigate();
        AuthService.logout(); // Faz a chamada ao serviço de logout
        navigate('/'); // Redireciona o usuário para a página de login após o logout
    };

    fetchData = async (id) => {
        // Substitua isso pela lógica de busca de dados real
        const token = localStorage.getItem('token'); // Replace with your actual token
        const jsonData = {
            coluna: 'id',
            dado: id
        };
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json', // Adjust the content type if needed
            },
        };

        try {
            // Fetch data using Axios
            const response = await axios.post('https://gestaoatestadoback.onrender.com/atestado/medico/getonly', jsonData, config);
            const formattedItems = response.data.map(item => ({
                id: item.atestado.id,
                paciente: item.pacienteFK.nome,
                rg: item.pacienteFK.rg,
                medico: item.medicoFK.nome,
                email: item.medicoFK.email,
                crm: item.medicoFK.crm,
                cid: item.atestado.cid,
                dataConsulta: item.atestado.dataConsulta,
                horaInicioConsulta: item.atestado.horaInicioConsulta,
                horaFimConsulta: item.atestado.horaFimConsulta,
                dispensaAlgorismo: item.atestado.dispensaAlgorismo,
                dispensaExtenso: item.atestado.dispensaExtenso
            }));
            this.setState({
                items: formattedItems,
                loading: false
            });
        } catch (error) {
            console.error('Erro ao buscar atestado:', error);
            this.setState({ loading: false });
        }
    };

    render() {
        return (
            <>
                <Container id='print' className='mx-auto p-4 text-center' >
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Card.Title id='Titulo-prin'>
                                        Hospital Gestor
                                    </Card.Title>
                                    <Card.Title id='Titulo-secun'>
                                        Atestado
                                    </Card.Title>
                                    <Card.Text>
                                        Eu, {this.state.items[0].medico}, portador(a) do CRM {this.state.items[0].crm}, atesto por meio
                                        deste documento que o(a) paciente {this.state.items[0].paciente}, portador(a) do RG {this.state.items[0].rg},<br />
                                        foi submetido(a) a uma consulta médica em {this.state.items[0].dataConsulta}, com início
                                        às {this.state.items[0].horaFimConsulta} e término às {this.state.items[0].horaFimConsulta}.<br />
                                        O(a) paciente está temporariamente incapaz de desempenhar suas atividades laborais,
                                        sendo recomendado um período de dispensa<br /> pelo prazo de {this.state.items[0].dispensaAlgorismo}({this.state.items[0].dispensaExtenso})
                                        dias, a contar da data desta consulta. Durante esse período,<br />
                                        o paciente requer repouso e cuidados médicos para sua pronta recuperação.<br /><br /><br />

                                        Assinatura: ____________________________<br />
                                        Nome do Médico: {this.state.items[0].medico} CRM: {this.state.items[0].crm}<br /><br />
                                        Data: {this.state.items[0].dataConsulta}<br /><br />
                                        Este atestado é válido a partir da data de emissão e possui valor legal,
                                        estando em conformidade com as regulamentações médicas vigentes.<br /><br />
                                        Atenciosamente, {this.state.items[0].medico}<br /><br />
                                        CRM: {this.state.items[0].crm}<br /><br />
                                        Contato: {this.state.items[0].email}<br /><br />
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

const MedicoEmitirAtestadoVerWrapper = () => {
    const { id } = useParams();
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => document.getElementById('print'),
    });
    const navigate = useNavigate();

    return (
        <div>
            <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="light">
                <Container fluid className='' id='nav'>
                    <Navbar.Brand href="/">Gestão de Atestado</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <Nav.Item>
                                <Nav.Link id='nav-link1-1' onClick={() => {
                                    navigate('/medico/dashboard')
                                }}>Dashboard</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link id='nav-link2-2' onClick={() => {
                                    navigate('/medico/emitiratestado')
                                }}>Emitir Atestado</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Button id='Button-pequeno' variant="primary" className='mr-4' onClick={() => {
                            navigate('/medico/dashboard')
                        }}>Sair</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <MedicoEmitirAtestadoVer id={id} ref={componentRef} />
            <Container className='mx-auto p-4 text-center'>
                <Row>
                    <Col>
                        <Button onClick={handlePrint}>Imprimir</Button>
                    </Col>
                    <Col>
                        <Button href='/medico/dashboard'>Voltar</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default MedicoEmitirAtestadoVerWrapper;
