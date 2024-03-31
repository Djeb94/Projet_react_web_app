describe('Shopping Cart Functionality', () => {
    it('should add item to cart', () => {
      cy.request('POST', 'http://localhost:5000/addProduct', {
        name: 'New Product',
        price: 10.99
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.message).to.eq('Produit creer');
      });
    });
  
    it('should delete cart item', () => {
      cy.request('DELETE', 'http://localhost:5000/api/items/1')
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.message).to.eq('Article deleted successfully');
        });
    });
  
    it('should modify cart item', () => {
      cy.request('PUT', 'http://localhost:5000/api/items/1', {
        name: 'Modified Product',
        price: 15.99
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.message).to.eq('Article updated successfully');
      });
    });
  });
  