import React from 'react';
import 'intersection-observer';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';

import './index.css';

class PicLazyLoad extends React.Component {
  static propTypes = {
    onLoaded: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    img: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    imgClassName: PropTypes.string,
    skeleton: PropTypes.string,
  };

  static defaultProps = {
    alt: '',
  };

  state = {
    loaded: false,
  };

  render() {
    const that = this;
    const { loaded } = that.state;
    const { img, alt, imgClassName, skeleton } = that.props;

    const onLoad = () => {
      that.setState({
        loaded: true,
      });
    };

    return (
      <div className="container">
        {loaded ? (
          <img className={ClassNames('defaultImg', imgClassName)} src={img} alt={alt} />
        ) : (
          <div className={ClassNames('skeleton1', skeleton)}></div>
        )}
        <img className="noShow" src={img} alt={alt} onLoad={onLoad} />
      </div>
    );
  }
}

class LazyLoadPic extends React.Component {
  static propTypes = {
    imgClassName: PropTypes.string,
    imgBoxClassName: PropTypes.string,
    alt: PropTypes.string,
  };

  static defaultProps = {
    alt: '',
  };

  state = {
    imgBlob: [],
  };

  getBase64 = (imgUrl, callback) => {
    let xhr = new XMLHttpRequest();

    xhr.open('get', imgUrl, true);
    xhr.responseType = 'blob';

    xhr.onload = e => {
      if (e.target.status === 200) {
        const blob = e.target.response;
        const oFileReader = new FileReader();

        oFileReader.onloadend = e => {
          callback(e.target.result);
        };

        oFileReader.readAsDataURL(blob);
      }
    };

    xhr.send();
  };

  callback = e => {
    const that = this;
    const { imgBlob } = that.state;

    that.setState({
      imgBlob: imgBlob.concat(e),
    });
  };

  onload = refs => {
    const that = this;
    const threshold = [0.02];
    // 这是触发时机 0.01代表出现 1%的面积出现在可视区触发一次回掉函数
    // threshold = [0, 0.25, 0.5, 0.75]
    // 表示分别在0% 25% 50% 75% 时触发回掉函数

    // 利用 IntersectionObserver 监听元素是否出现在视口
    const io = new IntersectionObserver(
      entries => {
        // 观察者
        entries.forEach(i => {
          const { target } = i;
          // entries 是被监听的元素集合它是一个数组
          if (i.intersectionRatio <= 0) {
            // intersectionRatio 是可见度 如果当前元素不可见就结束该函数。
            return null;
          }
          // 将 h5 自定义属性赋值给 src (进入可见区则加载图片)
          console.log(target.dataset.src);
          that.getBase64(target.dataset.src, that.callback);

          io.unobserve(target);
        });
      },
      {
        threshold, // 添加触发时机数组
      }
    );

    refs.map(i => {
      return io.observe(i.current);
    });
  };

  render() {
    const that = this;
    const { imgBlob } = that.state;
    const { alt, imgClassName, imgBoxClassName, boxClassName, imgArr } = that.props;

    let images = [];
    let refs = [];

    imgArr.map((d, i) => {
      const ref = React.createRef();

      refs.push(ref);

      return images.push(
        <div className={ClassNames('defaultImageBox', imgBoxClassName)} key={i}>
          <img
            key={i}
            className={ClassNames(imgBlob.length > 0 ? '' : 'L-skeleton1', imgClassName)}
            ref={ref}
            src={imgBlob.length > 0 ? imgBlob[i] : ''}
            alt=""
            data-src={d.url}
          />
        </div>
      );
    });

    const LazyLoadImg = (
      <div className={ClassNames('box', boxClassName)}>
        {images}
        <img onError={() => that.onload(refs)} src="" alt={alt} />
      </div>
    );

    return <div className="L-container">{LazyLoadImg}</div>;
  }
}

export { PicLazyLoad, LazyLoadPic };
