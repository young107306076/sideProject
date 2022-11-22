const PriceAndCollect = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid #3f3a3a;
`

const Collect = styled.div`
  height: 40px;
  width: 85px;
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const CollectImg = styled.img`
  width: 40px;
  height: 40px;
`

function Product(props) {
  const [product, setProduct] = React.useState();
  const [selectedColorCode, setSelectedColorCode] = React.useState();
  const [selectedSize, setSelectedSize] = React.useState();
  const [quantity, setQuantity] = React.useState(1);
  const [collectButtonUrl, setCollectButtonUrl] = React.useState('./images/dislike.jpg');
  const [isCollected, setIsCollected] = React.useState(false);
  React.useEffect(() => {
    const id = new URLSearchParams(location.search).get('id');
    api.getProduct(id).then((json) => {
      try {
        setSelectedColorCode(json.data.colors[0].code);
        setProduct(json.data);
      } catch (err) {
        // setProduct([]);
      }
    });
  }, []);

  React.useEffect(() => {
    if (product !== undefined)
      setIsCollected(checkCollect(product.id))
  }, [product]);

  React.useEffect(() => {
    if (isCollected)
      setCollectButtonUrl('./images/like.jpg')
    else 
      setCollectButtonUrl('./images/dislike.jpg')
  }, [isCollected]);

  if (!product) return (
    <div className="product">
      <p className="product__none">查無此產品</p>
    </div>
  );

  function getStock(colorCode, size) {
    return product.variants.find(
      (variant) => variant.color_code === colorCode && variant.size === size
    ).stock;
  }

  function renderProductColorSelector() {
    return (
      <div className="product__color-selector">
        {product.colors.map((color) => (
          <div
            key={color.code}
            className={`product__color${
              color.code === selectedColorCode
                ? ' product__color--selected'
                : ''
            }`}
            style={{ backgroundColor: `#${color.code}` }}
            onClick={() => {
              setSelectedColorCode(color.code);
              setSelectedSize();
              setQuantity(1);
            }}
          />
        ))}
      </div>
    );
  }

  function renderProductSizeSelector() {
    return (
      <div className="product__size-selector">
        {product.sizes.map((size) => {
          const stock = getStock(selectedColorCode, size);
          return (
            <div
              key={size}
              className={
                (product.id === 201807242232 || product.id === 201807242234) ?
                (`product__texture_new${
                  size === selectedSize ? ' product__texture_new--selected' : ''
                }${stock === 0 ? ' product__texture_new--disabled' : ''}`) :
                (`product__size${
                  size === selectedSize ? ' product__size--selected' : ''
                }${stock === 0 ? ' product__size--disabled' : ''}`)
              }
              onClick={() => {
                if (stock === 0) return;
                setSelectedSize(size);
                if (stock < quantity) setQuantity(1);
              }}
            >
              {size}
            </div>
          );
        })}
      </div>
    );
  }

  function renderProductQuantitySelector() {
    return (
      <div className="product__quantity-selector">
        <div
          className="product__quantity-minus"
          onClick={() => {
            if (!selectedSize) return;
            if (quantity === 1) return;
            setQuantity(quantity - 1);
          }}
        />
        <div className="product__quantity-value">{quantity}</div>
        <div
          className="product__quantity-add"
          onClick={() => {
            if (!selectedSize) return;
            const stock = getStock(selectedColorCode, selectedSize);
            if (quantity === stock) return;
            setQuantity(quantity + 1);
          }}
        />
      </div>
    );
  }

  function addToCart() {
    if (!selectedSize) {
      if (product.id === 201807242232 || product.id === 201807242234) {
        window.alert('請選擇質地');
      } else {
        window.alert('請選擇尺寸');
      }
      return;
    }
    const newCartItems = [
      ...props.cartItems,
      {
        color: product.colors.find((color) => color.code === selectedColorCode),
        id: product.id,
        image: product.main_image,
        name: product.title,
        price: product.price,
        qty: quantity,
        size: selectedSize,
        stock: getStock(selectedColorCode, selectedSize),
      },
    ];
    window.localStorage.setItem('cart', JSON.stringify(newCartItems));
    props.setCartItems(newCartItems);
    window.alert('已加入購物車');
  }

  function addCollectItem() {
    //Add collected item to DB
    api.addToWhistlist(parseInt(product.id), window.localStorage.getItem('jwtToken'))

    //Add collected item in localstorage
    const newCollectItems = [
      ...props.collectItems,
      {
        id: product.id,
        image: product.main_image,
        name: product.title,
        price: product.price,
        category: product.category,
      },
    ];
    console.log(newCollectItems)
    window.localStorage.setItem('collect', JSON.stringify(newCollectItems));
    props.setCollectItems(newCollectItems);
    window.alert('已加入收藏');
    setIsCollected(true)
  }

  function deleteCollectItem() {
    //Delete collected item in DB
    api.removeFromWhistlist(parseInt(product.id), window.localStorage.getItem('jwtToken'))

    //Delete collected item in localstorage
    const newCollectItems = props.collectItems.filter(
        (item, index) => item.id !== product.id
    );
    console.log(newCollectItems)
    props.setCollectItems(newCollectItems);
    window.localStorage.setItem('collect', JSON.stringify(newCollectItems));
    window.alert('已取消收藏');
    setIsCollected(false)
  }

  async function changeCollect() {
    //Check whether the item is already collected
    await new Promise((resolve) => {
      checkCollect()
      resolve()
    });

    await new Promise((resolve) => {
      if (!isCollected)
        addCollectItem()
      else
        deleteCollectItem()
      resolve()
    });
  }

  async function checkCollect() {
    await new Promise((resolve) => {
      for (let i = 0; i < props.collectItems.length; i++) {
        if (product.id === props.collectItems[i].id) {
          setIsCollected(true)
          return
        }
      }
      resolve()
    });

    await new Promise((resolve) => {
      setIsCollected(false)
      resolve()
    });
  }

  return (
    <div className="product">
      <img src={product.main_image} className="product__main-image" />
      <div className="product__detail">
        <div className="product__title">{product.title}</div>
        <div className="product__id">{product.id}</div>
        <PriceAndCollect>
          <div className="product__price">TWD.{product.price}</div>
          <Collect>
            <CollectImg src={collectButtonUrl} onClick={changeCollect}/>
            <div>收藏</div>
          </Collect>
        </PriceAndCollect>
        <div className="product__variant">
          <div className="product__color-title">顏色｜</div>
          {renderProductColorSelector()}
        </div>
        <div className="product__variant">
          <div className="product__size-title">
          {product.id === 201807242232 || product.id === 201807242234 ? '質地' : '尺寸'}｜
          </div>
          {renderProductSizeSelector()}
        </div>
        <div className="product__variant">
          <div className="product__quantity-title">數量｜</div>
          {renderProductQuantitySelector()}
        </div>
        <button className="product__add-to-cart-button" onClick={addToCart}>
          {selectedSize ? '加入購物車' : ((product.id === 201807242232 || product.id === 201807242234) ? '請選擇質地' : '請選擇尺寸')}
        </button>
        <div className="product__note">{product.note}</div>
        <div className="product__texture">{product.texture}</div>
        <div className="product__description">{product.description}</div>
        <div className="product__place">素材產地 / {product.place}</div>
        <div className="product__place">加工產地 / {product.place}</div>
      </div>
      <div className="product__story">
        <div className="product__story-title">細部說明</div>
        <div className="product__story-content">{product.story}</div>
      </div>
      <div className="product__images">
        {product.images.map((image, index) => (
          <img src={image} className="product__image" key={index} />
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
      <Product cartItems={cartItems} setCartItems={setCartItems} collectItems={collectItems} setCollectItems={setCollectItems} />
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
