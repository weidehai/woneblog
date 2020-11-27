# coding=utf-8
import imageio
import moviepy.editor as mpy

content = mpy.VideoFileClip("./1111.mp4")
c1 = content.subclip((0,0),(0,7))
c1.write_gif("test1.gif")