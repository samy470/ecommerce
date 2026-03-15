import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Rating,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Sample product (will be replaced with API data)
const product = {
  id: 1,
  name: 'Sample Product',
  price: 29.99,
  description: 'This is a detailed product description that provides information about the product features, specifications, and benefits.',
  image: 'https://via.placeholder.com/500',
  rating: 4.5,
  reviews: 10,
  stock: 5,
};

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon /> Back
      </IconButton>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box
              component="img"
              src={product.image}
              alt={product.name}
              sx={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} readOnly precision={0.5} />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviews} reviews)
            </Typography>
          </Box>

          <Typography variant="h5" color="primary" gutterBottom>
            ${product.price}
          </Typography>

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            Availability: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => dispatch(addToCart(product))}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/cart')}
            >
              View Cart
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProductDetails;