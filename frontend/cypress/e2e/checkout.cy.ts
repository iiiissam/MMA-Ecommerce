describe('Checkout Flow', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('/')
  })

  it('should complete a guest checkout', () => {
    // Navigate to collections
    cy.contains('Collections').click()
    
    // Wait for products to load
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).should('exist')
    
    // Click on first product
    cy.get('[data-testid="product-card"]').first().click()
    
    // Add to cart
    cy.contains('Add to Cart').click()
    
    // Go to cart
    cy.visit('/cart')
    
    // Proceed to checkout
    cy.contains('Proceed to Checkout').click()
    
    // Fill checkout form
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="first_name"]').type('Test')
    cy.get('input[name="last_name"]').type('User')
    cy.get('input[name="street"]').type('123 Main St')
    cy.get('input[name="city"]').type('Test City')
    cy.get('input[name="postal_code"]').type('12345')
    cy.get('input[name="country"]').type('Test Country')
    
    // Submit order
    cy.contains('Place Order').click()
    
    // Should redirect to success page
    cy.url().should('include', '/order-success')
    cy.contains('Order Confirmed').should('be.visible')
  })
})

