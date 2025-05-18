document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Black coffe", img: "1.jpg", price: 20000 },
      { id: 2, name: "Coffe beans black", img: "2.jpg", price: 86000 },
      { id: 3, name: "Robusta coffe", img: "3.jpg", price: 90000 },
      { id: 4, name: "Robusta black coffe", img: "4.jpg", price: 60000 },
      { id: 5, name: "white coffe", img: "4.jpg", price: 50000 },
      { id: 6, name: "Kopi beans", img: "5.jpg", price: 30000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      //untuk mengecek barang yang sama

      const cartItem = this.items.find((item) => item.id === newItem.id);

      //jika barang belum ada

      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        //jika barang ada dan belum ada yang sama
        this.items = this.items.map((item) => {
          //jika barang beda
          if (item.id !== newItem.id) {
            return item;
          } else {
            //jika barang sudah ada tambah quantity dan sub total
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      //ambil yg mau di apus
      const cartItem = this.items.find((item) => item.id === id);

      //jika ada lebih 1
      if (cartItem.quantity > 1) {
        this.items = this.items.map((item) => {
          //jika bukan barang yg diklik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        //jika barang sisa 1
        this.items = this.items.fillter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});


//form validasi
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');
form.addEventListener('keyup', function(){
  for(let i = 0; i < form.elements.length; i++) {
    if(form.elements[i].value.length !== 0){
      checkoutButton.classList.remove('disabled');
      checkoutButton.classList.add('disabled');
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove('disabled');
});


//kirim data setelah pesan
checkoutButton.addEventListener('click', function(e){
  e.preventDefault();
  const formData = new formData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  console.log (objData);
});
 

//konfersi rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
