type StockItemProps = {
    stock: {
      symbol: string;
      name: string;
    };
    onClick: () => void;
  };
  
  function StockItem({ stock, onClick }: StockItemProps) {
    return (
      <div
        onClick={onClick}
        style={{
          cursor: 'pointer',
          padding: '0.5rem 0',
          borderBottom: '1px solid #eee',
        }}
      >
        <strong>{stock.symbol}</strong> - {stock.name}
      </div>
    );
  }
  
  export default StockItem;
  