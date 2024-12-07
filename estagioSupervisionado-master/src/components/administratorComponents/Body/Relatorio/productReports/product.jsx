const handleSearchTopSellingByDate = async (e) => {
    e.preventDefault();
    try {
        const products = await getTopSellingProductsByDate(filters.date);
        setProductData(products);
    } catch (error) {
        setError(error.message);
    }
};

return (
    <div>
        <h2>Relatório de Produtos</h2>

        {/* Busca por Data para Produtos Mais Vendidos */}
        <form onSubmit={handleSearchTopSellingByDate}>
            <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                placeholder="Buscar por Data"
            />
            <button type="submit">Buscar Mais Vendidos</button>
        </form>

        {/* Lista de Produtos */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
            <h3>Produtos Encontrados</h3>
            <ul>
                {productData.length > 0 ? (
                    productData.map((product) => (
                        <li key={product.id}>
                            <h4>{product.name}</h4>
                            <p><strong>Ean:</strong> {product.ean}</p>
                            <p><strong>Descrição:</strong> {product.description}</p>
                            <p><strong>Preço:</strong> {product.price}</p>
                            <p><strong>Quantidade Vendida:</strong> {product.total_quantity}</p>
                            <p><strong>Tipo:</strong> {product.type}</p>
                            <p><strong>Grupo:</strong> {product.group}</p>
                        </li>
                    ))
                ) : (
                    <p>Nenhum produto encontrado.</p>
                )}
            </ul>
        </div>
    </div>
);
