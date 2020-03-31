import Taro, { Component, useScope, useDidShow, useEffect, useMemo, useLayoutEffect, useCallback } from '@tarojs/taro'
import { View, Text, Image, Button, Canvas } from '@tarojs/components'
import action from '../../store/actions'
import { useDispatch, useSelector } from '@tarojs/redux'
import * as TYPES from '../../store/action-types';
import './index.weapp.less';

const QR_URL = 'http://q801excwx.bkt.clouddn.com/923a73ee756214d7e523415a2f9acde.jpg';
const systemInfo = Taro.getSystemInfoSync();
const w = systemInfo.windowWidth;
//小程序二维码
import QR from '../../static/dongruan100.png' 

//设置坐标信息
const sircleX = .1 * w, sircleR = .075 * w,
  avatarX = 0.025 * w, avatarW = .15 * w,
  fontSize = (w / 375) * 18,
  text1X = .25 * w, text1Y = .08 * w,
  text2X = .25 * w, text2Y = .17 * w,
  qrX = .15 * w, qrY = .2 * w, qrW = .7 * w;


const ShareCanvas = ({ text1, text2, onCansel, user }) => {

  console.log('text1, text2 ,onCansel,user', text1, text2, onCansel, user);
  const scope = useScope();

  useDidShow(async () => {

    // 创建canvas对象
    let ctx = Taro.createCanvasContext('cardCanvas', scope)

    // 填充背景色

    ctx.setFillStyle("#fff")
    ctx.fillRect(0, 0, w, w)

    // // 绘制圆形用户头像
    let res = await Taro.downloadFile({
      url: user.avatarUrl
    })
    ctx.save()
    ctx.beginPath()

    ctx.arc(sircleX, sircleX, sircleR, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.stroke()/*  */
    ctx.drawImage(res.tempFilePath, avatarX, avatarX, avatarW, avatarW)
    ctx.restore()

    // 绘制文字
    ctx.save()
    ctx.setFontSize(fontSize)
    ctx.setFillStyle('black')
    ctx.fillText(text1, text1X, text1Y)
    ctx.fillText(text2, text2X, text2Y)
    ctx.restore()

    // 绘制二维码
    /* let qrcode = await Taro.downloadFile({
      url: QR_URL
    }) */
    ctx.drawImage(QR, qrX, qrY, qrW, qrW)
    // 将以上绘画操作进行渲染
    ctx.draw(false)
  });

  const saveCard = useCallback(async () => {
    // 将Canvas图片内容导出指定大小的图片
    let res = await Taro.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvasId: 'cardCanvas',
      fileType: 'png'
    }, scope)

    let saveRes = await Taro.saveImageToPhotosAlbum({
      filePath: res.tempFilePath
    })

    if (saveRes.errMsg === 'saveImageToPhotosAlbum:ok') {
      Taro.showModal({
        title: '图片保存成功',
        content: '图片成功保存到相册了，快去发朋友圈吧~',
        showCancel: false,
        confirmText: '确认'
      })
    } else {
      Taro.showModal({
        title: '图片保存失败',
        content: '请重新尝试!',
        showCancel: false,
        confirmText: '确认'
      })
    }
  }, []);

  return (
    <View className="canvas-wrap">
      <Canvas
        id="card-canvas"
        className="card-canvas"
        canvasId="cardCanvas" >
      </Canvas>
      <Button onClick={saveCard} className="btn-save" type="primary" >保存到相册</Button>
      <Button onClick={onCansel} className="btn-cansel" type="warn" >取消</Button>
    </View>
  )
}
export default ShareCanvas;

