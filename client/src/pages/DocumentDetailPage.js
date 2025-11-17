/**
 * DocumentDetailPage
 * Detailed view of a document with comments and download
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Form, ListGroup, Spinner } from 'react-bootstrap';
import { FiDownload, FiEye, FiStar, FiBookmark, FiTrash2, FiFlag } from 'react-icons/fi';
import { getDocumentById, downloadDocument, deleteDocument } from '../services/documentService';
import { addBookmark, removeBookmark } from '../services/bookmarkService';
import { addComment, getDocumentComments, deleteComment } from '../services/commentService';
import { useAuth } from '../context/AuthContext';

function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [document, setDocument] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentForm, setCommentForm] = useState({ content: '', rating: 0 });
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    loadDocument();
    loadComments();
  }, [id]);

  const loadDocument = async () => {
    try {
      const data = await getDocumentById(id);
      setDocument(data.data.document);
    } catch (error) {
      setError('Failed to load document');
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await getDocumentComments(id);
      setComments(data.data.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleDownload = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const response = await downloadDocument(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert(error.response?.data?.message || 'Download failed');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment({
        documentId: id,
        content: commentForm.content,
        rating: commentForm.rating > 0 ? commentForm.rating : null
      });
      setCommentForm({ content: '', rating: 0 });
      loadComments();
      loadDocument();
    } catch (error) {
      alert('Failed to add comment');
    }
  };

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await removeBookmark(id);
        setIsBookmarked(false);
      } else {
        await addBookmark(id);
        setIsBookmarked(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Bookmark action failed');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(id);
        navigate('/documents');
      } catch (error) {
        alert('Failed to delete document');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error || !document) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error || 'Document not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container className="main-content">
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <h1>{document.title}</h1>
              <div className="mb-3">
                <span className="text-muted">
                  by {document.author?.fullName}
                  {document.author?.isVerified && (
                    <Badge bg="success" className="ms-2">✓ Verified</Badge>
                  )}
                </span>
              </div>

              <div className="mb-3">
                {document.tags?.map((tag, index) => (
                  <Badge key={index} bg="secondary" className="me-2">
                    {tag}
                  </Badge>
                ))}
              </div>

              <p className="lead">{document.description}</p>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <FiEye /> {document.viewCount} views | <FiDownload /> {document.downloadCount} downloads
                </div>
                <div className="rating-stars">
                  <FiStar /> {document.averageRating?.toFixed(1) || 'N/A'} ({document.ratingCount} ratings)
                </div>
              </div>

              <div className="d-flex gap-2">
                <Button variant="primary" onClick={handleDownload}>
                  <FiDownload /> Download
                  {document.creditCost > 0 && ` (${document.creditCost} credits)`}
                </Button>
                {isAuthenticated && (
                  <Button variant="outline-secondary" onClick={handleBookmark}>
                    <FiBookmark /> {isBookmarked ? 'Unbookmark' : 'Bookmark'}
                  </Button>
                )}
                {user?.id === document.userId && (
                  <Button variant="danger" onClick={handleDelete}>
                    <FiTrash2 /> Delete
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h4>Comments & Ratings</h4>
            </Card.Header>
            <Card.Body>
              {isAuthenticated && (
                <Form onSubmit={handleCommentSubmit} className="mb-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Your Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={commentForm.content}
                      onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Rating (optional)</Form.Label>
                    <Form.Select
                      value={commentForm.rating}
                      onChange={(e) => setCommentForm({ ...commentForm, rating: parseInt(e.target.value) })}
                    >
                      <option value="0">No rating</option>
                      <option value="5">⭐⭐⭐⭐⭐ (5 stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4 stars)</option>
                      <option value="3">⭐⭐⭐ (3 stars)</option>
                      <option value="2">⭐⭐ (2 stars)</option>
                      <option value="1">⭐ (1 star)</option>
                    </Form.Select>
                  </Form.Group>
                  <Button type="submit" variant="primary">Submit Comment</Button>
                </Form>
              )}

              <ListGroup variant="flush">
                {comments.map((comment) => (
                  <ListGroup.Item key={comment.id}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{comment.user?.fullName}</strong>
                        {comment.rating && (
                          <span className="ms-2 rating-stars">
                            {'⭐'.repeat(comment.rating)}
                          </span>
                        )}
                        <p className="mb-1 mt-2">{comment.content}</p>
                        <small className="text-muted">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      {user?.id === comment.userId && (
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={async () => {
                            await deleteComment(comment.id);
                            loadComments();
                          }}
                        >
                          <FiTrash2 />
                        </Button>
                      )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>Document Information</Card.Header>
            <Card.Body>
              <p><strong>File:</strong> {document.fileName}</p>
              <p><strong>Type:</strong> {document.fileType}</p>
              <p><strong>Size:</strong> {(document.fileSize / 1024 / 1024).toFixed(2)} MB</p>
              {document.school && <p><strong>School:</strong> {document.school}</p>}
              {document.subject && <p><strong>Subject:</strong> {document.subject}</p>}
              <p><strong>Uploaded:</strong> {new Date(document.createdAt).toLocaleDateString()}</p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Author Information</Card.Header>
            <Card.Body>
              <p><strong>{document.author?.fullName}</strong></p>
              {document.author?.school && <p>School: {document.author.school}</p>}
              {document.author?.major && <p>Major: {document.author.major}</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DocumentDetailPage;
