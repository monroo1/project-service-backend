import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useNotification } from '@strapi/helper-plugin';
// @ts-ignore
import { Box, Typography, Loader } from '@strapi/design-system';

interface Portfolio {
  id: number;
  Name?: string;
  [key: string]: any;
}

const PortfolioOrderManager: React.FC = () => {
  const [items, setItems] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const toggleNotification = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioRes, orderRes] = await Promise.all([
          fetch('/api/portfolios', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }),
          fetch('/api/portfolio-orders/1?fields=order', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }),
        ]);

        if (!portfolioRes.ok) throw new Error('Failed to fetch portfolios');
        if (!orderRes.ok && orderRes.status !== 404) throw new Error('Failed to fetch order');

        const portfolioData = await portfolioRes.json();
        const portfolios = portfolioData.data || [];
        
        let savedOrder: number[] = [];
        if (orderRes.status === 200) {
          const orderData = await orderRes.json();
          savedOrder = orderData.data?.attributes?.order || [];
        }

        const sortedItems = savedOrder.length
          ? savedOrder
              // @ts-ignore
              .map((id) => portfolios.find((p) => p.id === id))
              .filter((item): item is Portfolio => Boolean(item))
          : portfolios;

        setItems(sortedItems);
        setLoading(false);

      } catch (error) {
        console.error('Error loading data:', error);
        toggleNotification({ type: 'warning', message: 'Failed to load data' });
        setLoading(false);
      }
    };

    fetchData();
  }, [toggleNotification]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [movedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, movedItem);
    const newOrder = newItems.map((item) => item.id);

    setItems(newItems);
    
    try {
      const response = await fetch('/api/portfolio-orders/1?pass=PS22052025', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ data: { order: newOrder } }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      toggleNotification({ type: 'success', message: 'Order saved' });
    } catch (error) {
      console.error('Error saving order:', error);
      toggleNotification({ type: 'warning', message: 'Failed to save order' });
    }
  };

  if (loading) return <Loader>Loading...</Loader>;

  return (
    <Box padding={4}>
      <Typography variant="alpha" as="h1">Manage Portfolio Order</Typography>
      
      <Box marginTop={4} background="neutral100" padding={4} hasRadius>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="portfolio-order">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          marginBottom: '8px',
                          padding: '16px',
                          backgroundColor: '#ffffff',
                          borderRadius: '4px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                          ...provided.draggableProps.style,
                        }}
                      >
                        <h1>
                          { `Portfolio #${item.id} - ${item?.Name}`}
                        </h1>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Box>
    </Box>
  );
};

export default PortfolioOrderManager;