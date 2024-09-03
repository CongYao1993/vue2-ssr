<template>
  <div id="app">
    <router-link to="/">home</router-link>
    <router-link to="/article">Article</router-link>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
