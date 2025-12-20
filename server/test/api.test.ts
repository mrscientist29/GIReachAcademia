import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import request from 'supertest'
import express from 'express'

describe('API Routes - Basic Tests', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
    app.use(express.json())
    
    // Simple test routes
    app.get('/api/test', (req, res) => {
      res.json({ message: 'Test successful' })
    })
    
    app.post('/api/test', (req, res) => {
      res.status(201).json({ message: 'Created', data: req.body })
    })
  })

  describe('Basic API Functionality', () => {
    it('should handle GET requests', async () => {
      const response = await request(app)
        .get('/api/test')
        .expect(200)

      expect(response.body).toEqual({ message: 'Test successful' })
    })

    it('should handle POST requests', async () => {
      const testData = { name: 'Test', value: 123 }
      
      const response = await request(app)
        .post('/api/test')
        .send(testData)
        .expect(201)

      expect(response.body).toEqual({
        message: 'Created',
        data: testData
      })
    })

    it('should handle JSON parsing', async () => {
      const testData = { complex: { nested: { data: 'value' } } }
      
      const response = await request(app)
        .post('/api/test')
        .send(testData)
        .expect(201)

      expect(response.body.data).toEqual(testData)
    })

    it('should handle 404 for unknown routes', async () => {
      await request(app)
        .get('/api/unknown')
        .expect(404)
    })
  })

  describe('Error Handling', () => {
    beforeEach(() => {
      app.get('/api/error', (req, res) => {
        throw new Error('Test error')
      })
    })

    it('should handle server errors', async () => {
      await request(app)
        .get('/api/error')
        .expect(500)
    })
  })
})