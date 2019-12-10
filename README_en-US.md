English | [中文](./README.md)


# react-lazyload-pic

> a lazyload-pic component for React

## Installation

```
$ npm install react-lazyload-pic --save
or
$ yarn add react-lazyload-pic
```

## Usage 
Method 1: Display after full loading only for the large picture to be displayed currently, 
and replace the picture with occupation bitmap when it is not fully loaded

![lazyloadlist.gif](https://i.loli.net/2019/12/09/1SF9QoBCuiMOW63.gif)
```javascript
import { PicLazyLoad } from "react-lazyload-pic";
import Sevn from '@/assets/sevn.jpg'

class App extends React.Component {
  state = {
    loaded : false
  }

  render() {
    const that = this;
    const { loaded } = that.state;
    const onLoad = () => {
      that.setState({
        loaded:true
      })
    }
   
    return <div className="container"> 
              <PicLazyLoad
                img={Sevn}             // images
                skeleton="newSkeleton" // Bitmap CSS Style(className)
                imgClassName="sevn"    // img className 
                alt="sevn"
                loaded={loaded}
                onLoad={onLoad}
              /> 
            </div>
  }
}

export default App;


//css 
{
  .container {
    display: flex;
    width: 100%;
    height: 100vh;
    font-size: 30px;
  }

  .newSkeleton,
  .sevn {
    width: 200px;
    height: 100px;
  }
}

```
Method 2: Lazy loading of picture list, when the picture is loaded, 
it will be displayed in the list

![lazyloadlist.gif](https://i.loli.net/2019/12/09/4dNFHoXhxE3jmcy.gif)
```javascript
import { LazyLoadPic } from "react-lazyload-pic";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      imgArr: []
    };
  }

  componentDidMount() {
    const that = this;
    let arr = [];

    for (let i = 1; i < 17; i++) {
      arr.push({ url: require(`./images/${i}.png`) });
    }

    that.setState({
      imgArr: _.concat(arr)
    });
  }

  render() {
    const that = this;
    const { imgArr } = that.state;

    return (
      <div className="container">
        <LazyLoadPic
          boxClassName="boxContainer"
          imgBoxClassName="imgBoxContainer"
          imgClassName="imgContainer"
          imgArr={imgArr}
        />
      </div>
    );
  }
}

export default App;

```


## Properties

```javascript 
  //Method 1
  static propTypes = {
    onLoaded: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    img: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    imgClassName: PropTypes.string,
    skeleton: PropTypes.string
  };

  static defaultProps = {
    alt: "",
  };

  //Method 2
   static propTypes = {
    imgClassName: PropTypes.string,
    imgBoxClassName: PropTypes.string,
    alt: PropTypes.string
  };

  static defaultProps = {
    alt: ""
  };
```

# License

MIT
