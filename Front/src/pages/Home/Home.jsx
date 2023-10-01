import './Home.css'
import {
    Container,
    Nav,
    Navbar,
    Button,
    Row,
    Col
} from "react-bootstrap";
import PC from '../../images/desk.svg';
function Home() {
    return (
        <>
            <Navbar  expand="lg" className="bg-body-tertiary" data-bs-theme="light">
                <Container fluid className='' id='nav'>
                    <Navbar.Brand href="/">Gestão de Atestado</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mx-auto">
                            <Nav.Item>
                                <Nav.Link className='nav-link' href="/">Home</Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Button id='Button-pequeno' variant="primary" className='mr-4' href='/login' >Login</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container bsPrefix='container-image'>
                <img src={PC} alt='computador'/>
            </Container>
            <Container fluid bsPrefix='container-text' className=''>
                <Row>
                    <Col className='h1'> Gestão de Atestados</Col>
                </Row>
                <Row>
                    <Col> Site para adiministração e emissão de atestados </Col>
                </Row>
                <Row>
                    <Col>
                        <Button id='Button-grande'  variant="primary" className='mt-4' href='/login'>Login</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
export default Home;