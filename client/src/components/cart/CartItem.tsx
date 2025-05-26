import { useState } from "react";
import { Link } from "wouter";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemWithProduct, ProductVariant } from "@shared/schema"; // Assuming ProductVariant is exported
import { useUpdateCartItem, useRemoveFromCart } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
// For optimistic updates (optional, uncomment if you implement it)
// import { useQueryClient } from "@tanstack/react-query";


interface CartItemProps {
  item: CartItemWithProduct;
}

const CartItem = ({ item }: CartItemProps) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const { toast } = useToast();
  // For optimistic updates (optional)
  // const queryClient = useQueryClient(); 

  const productPrice = item.product && typeof item.product.price === 'number' ? item.product.price : 0;
  const productStock = item.product && typeof item.product.stock === 'number' ? item.product.stock : 0;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return; // Can't go below 1
    if (newQuantity > productStock && productStock > 0) { // Only cap if stock is > 0
        toast({
            title: "Stock Limit Reached",
            description: `Only ${productStock} items available.`,
            variant: "default" // Or "destructive"
        });
        // Optionally set quantity to max stock here if you want to cap it strictly
        // setQuantity(productStock); 
        // newQuantity = productStock; // Ensure mutation uses capped value
        return; // Or let the mutation proceed and handle server-side validation
    }
    
    const oldQuantity = quantity; // Store current quantity for potential revert
    setQuantity(newQuantity); // Optimistically update local UI
    
    updateCartItem.mutate(
      { id: item.id, quantity: newQuantity },
      {
        onError: () => {
          setQuantity(oldQuantity); // Revert to original quantity on error
          toast({
            title: "Update Error",
            description: "Failed to update quantity. Please try again.",
            variant: "destructive"
          });
        }
        // onSettled: () => queryClient.invalidateQueries({ queryKey: ['/api/cart'] }) // If not using optimistic update's onSettled
      }
    );
  };

  const handleRemove = () => {
    removeFromCart.mutate(item.id, {
      onSuccess: () => {
        toast({
          title: "Item Removed",
          description: `${item.product?.name || 'The item'} has been removed from your cart.`
        });
        // No need to manually update local state if react-query invalidates and refetches '/api/cart'
      },
      onError: () => {
        toast({
          title: "Remove Error",
          description: "Failed to remove item. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  // Display variant information if available
  // Assuming item.variantInfo is ProductVariant[] | null | undefined
  const variantDisplay = Array.isArray(item.variantInfo) && item.variantInfo.length > 0
    ? item.variantInfo.map(variant => `${variant.name}: ${variant.value}`).join(", ")
    : item.variantInfo && typeof item.variantInfo === 'object' && 'name' in item.variantInfo && 'value' in item.variantInfo // Handle if it's accidentally a single object
    ? `${(item.variantInfo as ProductVariant).name}: ${(item.variantInfo as ProductVariant).value}`
    : null;

  const safeImages = item.product && Array.isArray(item.product.images) ? item.product.images : [];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-6 border-b border-border last:border-b-0">
      {/* Product Image */}
      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 mb-4 sm:mb-0 bg-muted rounded-md overflow-hidden">
        <Link href={`/product/${item.productId}`}> {/* Use item.productId for consistency */}
          {safeImages.length > 0 ? (
            <img
              src={safeImages[0]}
              alt={item.product?.name || 'Product Image'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground p-2 text-center">No Image</div>
          )}
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex-grow sm:pl-4 lg:pl-6 min-w-0"> {/* Added min-w-0 for better truncation */}
        <Link href={`/product/${item.productId}`}>
          <h3 className="font-medium text-foreground hover:text-primary transition-colors truncate" title={item.product?.name}>
            {item.product?.name || "Product Name Unavailable"}
          </h3>
        </Link>
        
        {variantDisplay && (
          <p className="text-xs text-muted-foreground mt-1 truncate" title={variantDisplay}>{variantDisplay}</p>
        )}
        
        <p className="text-primary font-semibold mt-1">₹{productPrice.toFixed(2)}</p>
        
        {productStock <= 5 && productStock > 0 && (
          <p className="text-amber-600 text-xs mt-1">Only {productStock} left in stock!</p>
        )}
        {productStock === 0 && (
            <p className="text-destructive text-xs mt-1">Out of stock</p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center mt-4 sm:mt-0 sm:mx-4 shrink-0">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-r-none border-r-0"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1 || updateCartItem.isPending}
          aria-label="Decrease quantity"
        >
          -
        </Button>
        <div className="h-8 w-10 flex items-center justify-center border-y border-input text-sm">
          {quantity}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-l-none border-l-0"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={(productStock > 0 && quantity >= productStock) || productStock === 0 || updateCartItem.isPending}
          aria-label="Increase quantity"
        >
          +
        </Button>
      </div>

      {/* Subtotal and Remove Button */}
      <div className="flex items-center mt-4 sm:mt-0 sm:ml-auto shrink-0">
        <p className="font-semibold text-foreground mr-4 sm:mr-6 w-24 text-right">
          ₹{(productPrice * quantity).toFixed(2)}
        </p>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-muted-foreground hover:text-destructive transition-colors"
          onClick={handleRemove}
          disabled={removeFromCart.isPending}
          aria-label={`Remove ${item.product?.name || 'item'} from cart`}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;