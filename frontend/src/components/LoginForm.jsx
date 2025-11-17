import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import useLogin from '../hooks/useLogin';

function LoginForm() {
  const { login, loading, error, user } = useLogin();
  const [formValues, setFormValues] = useState({ username: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formValues.username || !formValues.password) {
      return;
    }
    await login(formValues.username, formValues.password);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-4">會員登入</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {user && <Alert variant="success">歡迎 {user.displayName}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>帳號</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="輸入帳號"
              value={formValues.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4" controlId="password">
            <Form.Label>密碼</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="輸入密碼"
              value={formValues.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                登入中...
              </>
            ) : (
              '登入'
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default LoginForm;
