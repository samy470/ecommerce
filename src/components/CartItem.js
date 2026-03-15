import {
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
  Paper,
} from '@mui/material';
import { Delete, Add, Remove } from '@mui/icons-material';

function CartItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3} sm={2}>
          <Box
            component="img"
            src={item.image || 'https://via.placeholder.com/100'}
            alt={item.name}
            sx={{ width: '100%', height: 'auto', borderRadius: 1 }}
          />
        </Grid>
        <Grid item xs={9} sm={4}>
          <Typography variant="subtitle1">{item.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            ${item.price}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
            >
              <Remove />
            </IconButton>
            <TextField
              size="small"
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value > 0) {
                  onUpdateQuantity(value);
                }
              }}
              type="number"
              inputProps={{ min: 1, style: { textAlign: 'center' } }}
              sx={{ width: 60, mx: 1 }}
            />
            <IconButton
              size="small"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
            >
              <Add />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={4} sm={2}>
          <Typography variant="subtitle1">
            ${(item.price * item.quantity).toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={2} sm={1}>
          <IconButton color="error" onClick={onRemove}>
            <Delete />
          </IconButton>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default CartItem;