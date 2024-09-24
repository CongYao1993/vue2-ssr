<template>
  <div id="app">
    <router-link to="/">home</router-link>
    <router-link to="/article/1">Article1</router-link>
    <router-link to="/article/2">Article2</router-link>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
