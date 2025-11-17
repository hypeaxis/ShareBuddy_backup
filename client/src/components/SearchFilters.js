/**
 * SearchFilters component
 * Search and filter controls for documents
 */

import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';

function SearchFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    search: '',
    school: '',
    subject: '',
    tag: '',
    sortBy: 'createdAt',
    order: 'DESC'
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      school: '',
      subject: '',
      tag: '',
      sortBy: 'createdAt',
      order: 'DESC'
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <div className="search-filter-section">
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="text"
                name="search"
                placeholder="Search documents..."
                value={filters.search}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>School</Form.Label>
              <Form.Control
                type="text"
                name="school"
                placeholder="e.g., HUST"
                value={filters.school}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                placeholder="e.g., Math"
                value={filters.subject}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Tag</Form.Label>
              <Form.Control
                type="text"
                name="tag"
                placeholder="Filter by tag"
                value={filters.tag}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Sort By</Form.Label>
              <Form.Select name="sortBy" value={filters.sortBy} onChange={handleChange}>
                <option value="createdAt">Date Added</option>
                <option value="downloadCount">Most Downloaded</option>
                <option value="averageRating">Highest Rated</option>
                <option value="viewCount">Most Viewed</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Order</Form.Label>
              <Form.Select name="order" value={filters.order} onChange={handleChange}>
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">
            <FiSearch /> Search
          </Button>
          <Button type="button" variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default SearchFilters;
