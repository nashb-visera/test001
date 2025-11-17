package com.example.login.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.login.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    @Select("SELECT ID, USERNAME, PASSWORD_HASH, DISPLAY_NAME, ACTIVE, LAST_LOGIN_AT FROM APP_USER WHERE USERNAME = #{username}")
    User findByUsername(String username);
}
