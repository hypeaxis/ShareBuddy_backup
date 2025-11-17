/**
 * BookmarksPage
 * Display user's bookmarked documents
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { getBookmarks } from '../services/bookmarkService';
import DocumentCard from '../components/DocumentCard';

function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const data = await getBookmarks();
      setBookmarks(data.data.bookmarks);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="main-content">
      <h1 className="mb-4">My Bookmarks</h1>
      
      {bookmarks.length === 0 ? (
        <Alert variant="info">
          You haven't bookmarked any documents yet. Start exploring and save documents for later!
        </Alert>
      ) : (
        <Row>
          {bookmarks.map((bookmark) => (
            <Col key={bookmark.id} md={4} lg={3} className="mb-4">
              <DocumentCard document={bookmark.document} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default BookmarksPage;
