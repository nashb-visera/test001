import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from './components/LoginForm';
import PortalLayout from './components/PortalLayout';
import useLogin from './hooks/useLogin';

function App() {
  const { login, loading, error, user } = useLogin();

  if (user) {
    return <PortalLayout user={user} />;
  }

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100">
        <Col md={{ span: 4, offset: 4 }}>
          <LoginForm onLogin={login} loading={loading} error={error} />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
