<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Gestão de Tarefas</v-toolbar-title>
      <v-spacer />
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/tasks">Tarefas</v-btn>
      <v-btn text to="/profile">Perfil</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>