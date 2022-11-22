function Collect(props) {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [time, setTime] = React.useState();

    function deleteCollectItem(productID, itemIndex) {
        //Delete collected item in DB
        api.removeFromWhistlist(parseInt(productID), window.localStorage.getItem('jwtToken'))
    
        //Delete collected item in localstorage
        const newCollectItems = props.collectItems.filter(
            (_, index) => index !== itemIndex
        );
        console.log(newCollectItems)
        props.setCollectItems(newCollectItems);
        window.localStorage.setItem('collect', JSON.stringify(newCollectItems));
        window.alert('已取消收藏');
      }
  
    return (
        <div className="collect">
            <div className="collect__header">
                <div className="collect__header-number">
                我的收藏({props.collectItems.length})
                </div>
            </div>
            <div className="collect__items">
                {props.collectItems.map((item, index) => (
                    <div className="collect__item" key={index}>
                        <img src={item.image} className="collect__item-image" />
                        <div className="collect__item-detail">
                            <div className="collect__item-name">{item.name}</div>
                            <div className="collect__item-id">{item.id}</div>
                            <div className="collect__item-price">NT.{item.price}</div>
                        </div>
                        <div
                            className="collect__delete-button"
                            onClick={() => deleteCollectItem(item.id, index)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
  }
  
  function App() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const collect = JSON.parse(localStorage.getItem('collect') || '[]');
    const [cartItems, setCartItems] = React.useState(cart);
    const [collectItems, setCollectItems] = React.useState(collect);
    return (
      <React.Fragment>
        <Header cartItems={cartItems} />
        <Collect collectItems={collectItems} setCollectItems={setCollectItems} />
        <Footer />
      </React.Fragment>
    );
  }
  
  ReactDOM.render(<App />, document.querySelector('#root'));
  