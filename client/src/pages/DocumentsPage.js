/**
 * DocumentsPage
 * Browse and search documents
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Pagination } from 'react-bootstrap';
import { getDocuments } from '../services/documentService';
import DocumentCard from '../components/DocumentCard';
import SearchFilters from '../components/SearchFilters';

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadDocuments();
  }, [pagination.page, filters]);

  const loadDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDocuments({ ...filters, page: pagination.page });
      setDocuments(data.data.documents);
      setPagination(data.data.pagination);
    } catch (error) {
      setError('Failed to load documents');
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
    window.scrollTo(0, 0);
  };

  return (
    <Container className="main-content">
      <h1 className="mb-4">Browse Documents</h1>
      
      <SearchFilters onSearch={handleSearch} />

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : documents.length === 0 ? (
        <Alert variant="info">No documents found. Try adjusting your filters.</Alert>
      ) : (
        <>
          <Row>
            {documents.map((doc) => (
              <Col key={doc.id} md={4} lg={3} className="mb-4">
                <DocumentCard document={doc} />
              </Col>
            ))}
          </Row>

          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First 
                  onClick={() => handlePageChange(1)} 
                  disabled={pagination.page === 1}
                />
                <Pagination.Prev 
                  onClick={() => handlePageChange(pagination.page - 1)} 
                  disabled={pagination.page === 1}
                />
                
                {[...Array(pagination.pages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === pagination.page}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next 
                  onClick={() => handlePageChange(pagination.page + 1)} 
                  disabled={pagination.page === pagination.pages}
                />
                <Pagination.Last 
                  onClick={() => handlePageChange(pagination.pages)} 
                  disabled={pagination.page === pagination.pages}
                />
              </Pagination>
            </div>
          )}

          <div className="text-center text-muted mt-3">
            <small>Showing {documents.length} of {pagination.total} documents</small>
          </div>
        </>
      )}
    </Container>
  );
}

export default DocumentsPage;
