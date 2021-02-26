from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import DataRequired, Length

class LoginForm(FlaskForm):
    username = StringField('username', validators=[DataRequired(message=u'邮箱不能为空'),Length(1, 20)])
    password = PasswordField('password',validators=[DataRequired(message=u'密码不能为空'),Length(1, 128)])
    submit = SubmitField(u'登录')