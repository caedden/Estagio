async function getProduct(id) {
    try {
        const response = await fetch('http://localhost:3000/api/products/${id}');

        if (response.ok) {
            const product = await response.json();
            console.log(product); 
            return product;
        } else {
            throw new Error('Erro ao obter produto com id: ${id}');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

for (array in rowsBanco){
    
}