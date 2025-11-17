/**
 * HomePage
 * Landing page with featured documents and quick links
 */

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getDocuments } from '../services/documentService';
import DocumentCard from '../components/DocumentCard';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { isAuthenticated } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments({ limit: 6, sortBy: 'downloadCount', order: 'DESC' });
      setDocuments(data.data.documents);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="display-4">Welcome to Document Sharing Platform</h1>
              <p className="lead">
                Share, discover, and download educational materials from students and teachers worldwide.
              </p>
              <div className="d-flex gap-3">
                {!isAuthenticated ? (
                  <>
                    <Button as={Link} to="/register" variant="light" size="lg">
                      Get Started
                    </Button>
                    <Button as={Link} to="/documents" variant="outline-light" size="lg">
                      Browse Documents
                    </Button>
                  </>
                ) : (
                  <>
                    <Button as={Link} to="/upload" variant="light" size="lg">
                      Upload Document
                    </Button>
                    <Button as={Link} to="/documents" variant="outline-light" size="lg">
                      Browse All
                    </Button>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="my-5">
        <h2 className="mb-4">Popular Documents</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Row>
            {documents.map((doc) => (
              <Col key={doc.id} md={4} className="mb-4">
                <DocumentCard document={doc} />
              </Col>
            ))}
          </Row>
        )}
        
        <div className="text-center mt-4">
          <Button as={Link} to="/documents" variant="primary" size="lg">
            View All Documents
          </Button>
        </div>
      </Container>

      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-5">Why Choose Us?</h2>
          <Row>
            <Col md={4} className="text-center mb-4">
              <div className="display-4 mb-3">📚</div>
              <h4>Vast Library</h4>
              <p>Access thousands of documents across various subjects and schools.</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="display-4 mb-3">⭐</div>
              <h4>Quality Content</h4>
              <p>Rated and reviewed by the community to ensure high quality.</p>
            </Col>
            <Col md={4} className="text-center mb-4">
              <div className="display-4 mb-3">🎁</div>
              <h4>Earn Credits</h4>
              <p>Upload documents and earn credits to download premium content.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default HomePage;
