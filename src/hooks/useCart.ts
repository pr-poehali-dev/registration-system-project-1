
import { useState, useEffect, createContext, useContext } from 'react'
import { CartItem, Product } from '@/types/product'
import { useAuth } from './useAuth'

const CartContext = createContext<{
  cartItems: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => 0,
  getCartCount: () => 0
})

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { authState } = useAuth()

  useEffect(() => {
    if (authState.user) {
      const savedCart = localStorage.getItem(`cart_${authState.user.id}`)
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    } else {
      setCartItems([])
    }
  }, [authState.user])

  const saveCart = (items: CartItem[]) => {
    if (authState.user) {
      localStorage.setItem(`cart_${authState.user.id}`, JSON.stringify(items))
    }
  }

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      let newItems
      
      if (existing) {
        newItems = prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...prev, { ...product, quantity: 1 }]
      }
      
      saveCart(newItems)
      return newItems
    })
  }

  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => item.id !== productId)
      saveCart(newItems)
      return newItems
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev => {
      const newItems = prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
      saveCart(newItems)
      return newItems
    })
  }

  const clearCart = () => {
    setCartItems([])
    if (authState.user) {
      localStorage.removeItem(`cart_${authState.user.id}`)
    }
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}
