import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';

const quickLinks = [
  { key: 'announcements', label: '最新公告' },
  { key: 'workflow', label: '工作流程' },
  { key: 'reports', label: '報表查詢' },
  { key: 'support', label: '客服支援' }
];

const infoCards = [
  {
    title: '今日待辦事項',
    description: '共有 5 筆待處理簽核與任務，請儘速完成。'
  },
  {
    title: '系統公告',
    description: '週五晚間 10 點至 12 點進行系統維護，期間暫停服務。'
  },
  {
    title: '快速資源',
    description: '連結到常用的人資、差旅、IT 服務與其他入口。'
  }
];

function PortalLayout({ user }) {
  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <header className="bg-primary text-white py-4 shadow-sm">
        <Container className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <p className="text-uppercase fw-semibold mb-1">企業入口網站</p>
            <h1 className="h3 mb-0">歡迎回來，{user.displayName}</h1>
            <p className="mb-0 text-white-50">請在此檢視公告、處理待辦或啟動常用流程</p>
          </div>
          <div className="text-md-end">
            <p className="mb-1 small text-white-50">身分識別碼</p>
            <p className="mb-0 fs-5">#{user.userId}</p>
          </div>
        </Container>
      </header>

      <Navbar bg="white" expand="md" className="border-bottom shadow-sm">
        <Container>
          <Navbar.Brand className="fw-semibold">Portal 導覽</Navbar.Brand>
          <Navbar.Toggle aria-controls="portal-nav" />
          <Navbar.Collapse id="portal-nav">
            <Nav className="me-auto">
              {quickLinks.map((link) => (
                <Nav.Link key={link.key} href={`#${link.key}`}>
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>
            <Button variant="outline-primary" size="sm">
              個人設定
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="py-4 flex-grow-1">
        <Container>
          <Row className="g-4">
            {infoCards.map((card) => (
              <Col md={4} key={card.title}>
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title>{card.title}</Card.Title>
                    <Card.Text>{card.description}</Card.Text>
                    <Button variant="link" className="ps-0">
                      檢視詳細
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </main>
    </div>
  );
}

PortalLayout.propTypes = {
  user: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    displayName: PropTypes.string.isRequired
  }).isRequired
};

export default PortalLayout;
