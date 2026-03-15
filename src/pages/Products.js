import React, { useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import ProductCard from '../components/ProductCard';
import { setCategory } from '../redux/productSlice';

// Sample product data (will be replaced with API data)
const sampleProducts = [
  { id: 1, name: 'Product 1', price: 29.99, description: 'Description 1', category: 'electronics', rating: 4, reviews: 10 },
  { id: 2, name: 'Product 2', price: 39.99, description: 'Description 2', category: 'clothing', rating: 5, reviews: 15 },
  { id: 3, name: 'Product 3', price: 49.99, description: 'Description 3', category: 'books', rating: 3, reviews: 5 },
  // Add more products as needed
];

function Products() {
  const dispatch = useDispatch();
  const { searchQuery, category } = useSelector((state) => state.products);
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 8;

  // Filter products based on search and category
  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => dispatch(setCategory(e.target.value))}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="electronics">Electronics</MenuItem>
            <MenuItem value="clothing">Clothing</MenuItem>
            <MenuItem value="books">Books</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Products Grid */}
      {displayedProducts.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {displayedProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pageCount > 1 && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      ) : (
        <Typography variant="h6" align="center" color="text.secondary">
          No products found
        </Typography>
      )}
    </Container>
  );
}

export default Products;