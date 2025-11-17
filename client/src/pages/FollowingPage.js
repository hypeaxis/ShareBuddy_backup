/**
 * FollowingPage
 * Display followed users and their recent documents
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Alert, Spinner, Tab, Tabs } from 'react-bootstrap';
import { getFollowing, getFollowingFeed } from '../services/followService';

function FollowingPage() {
  const [following, setFollowing] = useState([]);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [followingData, feedData] = await Promise.all([
        getFollowing(),
        getFollowingFeed()
      ]);
      setFollowing(followingData.data.following);
      setFeed(feedData.data.documents);
    } catch (error) {
      console.error('Error loading data:', error);
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
      <h1 className="mb-4">Following</h1>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
        <Tab eventKey="feed" title="Recent Documents">
          {feed.length === 0 ? (
            <Alert variant="info">
              No recent documents from people you follow. Start following authors to see their latest uploads!
            </Alert>
          ) : (
            <div>
              {feed.map((doc) => (
                <Card key={doc.id} className="mb-3 following-feed-item">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5>{doc.title}</h5>
                        <p className="text-muted mb-2">
                          by {doc.author?.fullName} • {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mb-0">{doc.description}</p>
                      </div>
                      <a href={`/documents/${doc.id}`} className="btn btn-primary">
                        View
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Tab>

        <Tab eventKey="list" title="Following List">
          {following.length === 0 ? (
            <Alert variant="info">
              You're not following anyone yet. Follow authors to get updates on their new documents!
            </Alert>
          ) : (
            <Row>
              {following.map((user) => (
                <Col key={user.id} md={6} lg={4} className="mb-3">
                  <Card>
                    <Card.Body>
                      <div className="text-center">
                        <div style={{
                          width: '80px',
                          height: '80px',
                          background: '#007bff',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '32px',
                          margin: '0 auto 1rem'
                        }}>
                          {user.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <h6>{user.fullName}</h6>
                        {user.school && <small className="text-muted">{user.school}</small>}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
}

export default FollowingPage;
