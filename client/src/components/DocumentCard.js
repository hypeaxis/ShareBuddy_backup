/**
 * DocumentCard component
 * Displays a document card with key information
 */

import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FiDownload, FiEye, FiStar } from 'react-icons/fi';

function DocumentCard({ document }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/documents/${document.id}`);
  };

  return (
    <Card className="document-card h-100" onClick={handleClick}>
      <Card.Body>
        <Card.Title>{document.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          by {document.author?.fullName}
          {document.author?.isVerified && (
            <Badge bg="success" className="ms-2">✓ Verified</Badge>
          )}
        </Card.Subtitle>
        <Card.Text className="text-truncate">
          {document.description || 'No description'}
        </Card.Text>
        
        <div className="mb-2">
          {document.tags?.slice(0, 3).map((tag, index) => (
            <Badge key={index} bg="secondary" className="tag-badge">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            <FiEye /> {document.viewCount} | <FiDownload /> {document.downloadCount}
          </small>
          <div>
            <span className="rating-stars">
              <FiStar /> {document.averageRating?.toFixed(1) || 'N/A'}
            </span>
            {document.creditCost > 0 && (
              <Badge bg="warning" text="dark" className="ms-2">
                {document.creditCost} credits
              </Badge>
            )}
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="text-muted">
        <small>
          {document.school && `${document.school} • `}
          {document.subject || 'General'}
        </small>
      </Card.Footer>
    </Card>
  );
}

export default DocumentCard;
