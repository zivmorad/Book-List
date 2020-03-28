class Book {
    constructor(title,author,isbn){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
    }
};
class UI{
    //add book to list
    addBookToList(book){
        const list=document.querySelector('#book-list');
        //create tr element
        const row=document.createElement('tr');
        //insert cols
        row.innerHTML=`
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X<a></td>`;
        //append the cols to the row
        list.appendChild(row);
    }

    //clear fields
    clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';

    }

    showAlert(msg,classname){
        //create a div
        const div=document.createElement('div');
        //create class name
        div.className=`alert ${classname}`;
        //create text node
        div.appendChild(document.createTextNode(msg));
        //get parent
        const container=document.querySelector('.container');
        //get form
        const form=document.querySelector('#book-form');
        //insert the alert
        container.insertBefore(div,form);
        //set time out
        setTimeout(function(){
            document.querySelector('.alert').remove()},2000);
    }
    //delete booke
    deleteBook(target) {
        if(target.className === 'delete') {
          target.parentElement.parentElement.remove();
        }
      }
    
};

// Local Storage Class
class Store {
    static getBooks() {
      let books;
      if(localStorage.getItem('books') === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem('books'));
      }
  
      return books;
    }
  
    static displayBooks() {
      const books = Store.getBooks();
  
      books.forEach(function(book){
        const ui  = new UI;
  
        // Add book to UI
        ui.addBookToList(book);
      });
    }
  
    static addBook(book) {
      const books = Store.getBooks();
  
      books.push(book);
  
      localStorage.setItem('books', JSON.stringify(books));
    }
  
    static removeBook(isbn) {
      const books = Store.getBooks();
  
      books.forEach(function(book, index){
       if(book.isbn === isbn) {
        books.splice(index, 1);
       }
      });
  
      localStorage.setItem('books', JSON.stringify(books));
    }
  }

//dom load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

//event listeners
document.querySelector('#book-form').addEventListener('submit',
function(e){
    //define form vars
    const title=document.querySelector('#title').value;
    const author=document.querySelector('#author').value;
    const isbn=document.querySelector('#isbn').value;

    //instantiate book
    const book=new Book(title,author,isbn);

    //instantiate book
    const ui=new UI();

    //validate
    if(title===''||author===''||isbn===''){
        ui.showAlert('Please fill al the fields','error')
    } else {
        //add book to list
        ui.addBookToList(book);
        console.log(book);
        //add Book to LS
        Store.addBook(book);
        //show alert
        ui.showAlert('Book added!','success');
        //clear fields
        ui.clearFields();
    }
    e.preventDefault();
});

//event listener for delete
document.querySelector('#book-list').addEventListener('click',
function(e){
    //instantiate UI
    const ui=new UI();
    //delete book
    ui.deleteBook(e.target);
    //remove book from LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    //show message
    ui.showAlert('Book removed!','success');

    e.preventDefault();
})