import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100">
        <Col md={{ span: 4, offset: 4 }}>
          <LoginForm />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
