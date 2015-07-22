module.exports = function(grunt) {

  var crypto = require('crypto');
  var fs = require('fs');

  //对随机16位数字加密
  var hashTmp = crypto.createHash('md5').update(String(Math.random() * 10000000000000000)).digest('hex');
  var randomNum = hashTmp.slice(0, 6);
  var buidPath = 'build/release-' + randomNum;
  var nvwaLoaderVersion = 'nvwa-loader-1.0.0';
  var concat_css_file_path = buidPath + '/css/<%= pkg.name %>-<%= pkg.version %>.css';
  var concat_js_file_path = buidPath + '/js/<%= pkg.name %>-<%= pkg.version %>.js';
  grunt.log.writeln("===============" + randomNum + "===========");

  grunt.log.writeln("==========================");
  grunt.log.writeln("==========================");
  grunt.log.writeln("grunt自动脚本开始运行......");
  grunt.log.writeln("==========================");
  grunt.log.writeln("==========================");
  grunt.log.writeln("====请稍后，先观赏神兽====");
  grunt.log.writeln(" ");
  grunt.log.writeln(" ");
  grunt.log.writeln(" ");
  grunt.log.writeln("上帝的骑宠，上古时期世界的霸主。");

  grunt.log.writeln("┏┛┻━━━┛┻┓");
  grunt.log.writeln("┃｜｜｜｜｜｜｜┃");
  grunt.log.writeln("┃　　　━　　　┃");
  grunt.log.writeln("┃　┳┛ 　┗┳ ┃");
  grunt.log.writeln("┃　　　　　　　┃");
  grunt.log.writeln("┃　　　┻　　　┃");
  grunt.log.writeln("┃　　　　　　　┃");
  grunt.log.writeln("┗━┓　　　┏━┛");
  grunt.log.writeln("　　┃　史　┃　　");
  grunt.log.writeln("　　┃　诗　┃　　");
  grunt.log.writeln("　　┃　之　┃　　");
  grunt.log.writeln("　　┃　宠　┃");
  grunt.log.writeln("　　┃　　　┗━━━┓");
  grunt.log.writeln("　　┃经验与我同在　┣┓");
  grunt.log.writeln("　　┃攻楼专用宠物　┃");
  grunt.log.writeln("　　┗┓┓┏━┳┓┏┛");
  grunt.log.writeln("　　　┃┫┫　┃┫┫");
  grunt.log.writeln("　　　┗┻┛　┗┻┛");
  grunt.log.writeln(" ");
  grunt.log.writeln(" ");
  grunt.log.writeln(" ");

  grunt.log.writeln("任务执行详情：");
  grunt.log.writeln("");

  var md5Str = function(filePath, fileType) {
    var file = filePath.replace('nvwa-client', 'nvwa-client-' + fileType) + '.js';
    var hash = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
    var suffix = hash.slice(0, 6);
    console.log('suffix=' + suffix);
    var final_name = filePath + '.' + suffix + '.js';
    console.log(final_name);
    var minFile = final_name.split('/')[final_name.split('/').length - 1];
    return minFile;
  }

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    buildConfig: {
      randomNum: randomNum,
      path: buidPath
    },
    clean: {
      all: ['build']
    },
    less: {
      development: {
        options: {
          compress: false
        },
        files: {
          "css/main.css": "less/main.less"
        }
      },
      production: {
        options: {
          compress: true,
          optimization: 2,
          cleancss: true
        },
        files: {
          "css/main.css": "less/main.less"
        }
      }
    },
    watch: {
      styles: {
        files: ['less/*.less'],
        tasks: ['less', 'concat'],
        options: {
          nospawn: true
        }
      }
    },
    filerev: {
      options: {
        encoding: 'utf8',
        algorithm: 'md5',
        length: 6
      },
      js: {
        src: [buidPath + '/js/*.js'],
        dest: buidPath + '/js'
      },
      css: {
        src: buidPath + '/css/*.css',
        dest: buidPath + '/css'
      }
      /*  tpl: {
          src: 'js/**/
      /*template/*.tpl',
              dest: buidPath + '/tpl'
            }*/
    },
    jst: { //压缩模板
      compile: {
        options: {
          amd: true,
          templateSettings: {
            interpolate: /\{\{(.+?)\}\}/g,
            variable: 'data'
          },
          prettify: true
        },
        files: { //输出压缩后的文件
          "<%=buildConfig.path%>/js/<%= pkg.name %>-util-<%= pkg.version %>-templates.js": ["js/util/ui/template/*.tpl"],
          "<%=buildConfig.path%>/js/<%= pkg.name %>-core-<%= pkg.version %>-templates.js": ["js/core/container/template/*.tpl", "js/core/container/util/template/*.tpl", "js/core/element/template/*.tpl", "js/core/page/template/*.tpl"],
          "<%=buildConfig.path%>/js/<%= pkg.name %>-user-<%= pkg.version %>-templates.js": ["js/user/template/*.tpl"],
          "<%=buildConfig.path%>/js/<%= pkg.name %>-producer-<%= pkg.version %>-templates.js": ["js/producer/template/*.tpl"]
        }
      }
    },
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n' //默认banner
      },
      css: { //css合并配置
        //src: ['css/app.uncompressed.css'], //当前grunt项目中路径下的src/css目录下的所有css文件  
        //dest: 'build/css/<%= pkg.name %>-<%= pkg.version %>.css' //生成到grunt项目路径下的dist文件夹下为all.css  
        files: {
          'build/release-<%=buildConfig.randomNum%>/css/<%= pkg.name %>-<%= pkg.version %>.css': [

            //  'js/bower_components/user-index/css/bootstrap.min.css', //user端css
            //   'js/bower_components/user-index/css/bootstrap-responsive.min.css', //user端css
            'js/bower_components/user-index/css/user-index.css', //user端css
            //  'js/bower_components/user-login/css/user-login.css', //user端css
            'css/yestrap.css',
            'css/main.css',


            // 'css/yestrap_light.css'
          ]
        }
      },
      js: { //js合并配置
        files: {
          'build/release-<%=buildConfig.randomNum%>/js/<%= pkg.name %>-util-<%= pkg.version %>.js': [
            '<%=buildConfig.path%>/js/<%= pkg.name %>-util-<%= pkg.version %>-templates.js',
            'js/util/**/*.js'
          ],
          'build/release-<%=buildConfig.randomNum%>/js/<%= pkg.name %>-core-<%= pkg.version %>.js': [
            '<%=buildConfig.path%>/js/<%= pkg.name %>-core-<%= pkg.version %>-templates.js',
            'js/core/**/*.js'
          ],
          'build/release-<%=buildConfig.randomNum%>/js/<%= pkg.name %>-user-<%= pkg.version %>.js': [
            '<%=buildConfig.path%>/js/<%= pkg.name %>-user-<%= pkg.version %>-templates.js',
            'js/user/view/*.js',
            'js/user/router.js',
            'js/user/index.js'
          ],
          'build/release-<%=buildConfig.randomNum%>/js/<%= pkg.name %>-producer-<%= pkg.version %>.js': [
            '<%=buildConfig.path%>/js/<%= pkg.name %>-producer-<%= pkg.version %>-templates.js',
            'js/producer/view/*.js',
            'js/producer/router.js',
            'js/producer/index.js'
          ]
        }
      }
      /*   uijs: {
           src: [
             'lib/jquery/1.11.2/jquery.js',
             'lib/flexslider/jquery.flexslider.js',
             'lib/main.js'
           ],
           dest: 'lib/app.uncompressed.js'
         }*/
    },
    cssmin: { //css文件压缩  
      css: {
        src: buidPath + '/css/<%= pkg.name %>-<%= pkg.version %>.css', //将之前的all.css  
        dest: buidPath + '/css/<%= pkg.name %>-<%= pkg.version %>.min.css' //压缩  
      }
    },
    uglify: { //js文件压缩
      build: {
        files: {
          //    src: buidPath + '/js/<%= pkg.name %>-<%= pkg.version %>.js', //压缩源文件是之前合并的buildt.js文件  
          //    dest: buidPath + '/js/<%= pkg.name %>-<%= pkg.version %>.min.js' //压缩  
          '<%=buildConfig.path%>/js/<%= pkg.name %>-util-<%= pkg.version %>.min.js': ['<%=buildConfig.path%>/js/<%= pkg.name %>-util-<%= pkg.version %>.js'],
          '<%=buildConfig.path%>/js/<%= pkg.name %>-core-<%= pkg.version %>.min.js': ['<%=buildConfig.path%>/js/<%= pkg.name %>-core-<%= pkg.version %>.js'],
          '<%=buildConfig.path%>/js/<%= pkg.name %>-user-<%= pkg.version %>.min.js': ['<%=buildConfig.path%>/js/<%= pkg.name %>-user-<%= pkg.version %>.js'],
          '<%=buildConfig.path%>/js/<%= pkg.name %>-producer-<%= pkg.version %>.min.js': ['<%=buildConfig.path%>/js/<%= pkg.name %>-producer-<%= pkg.version %>.js']
        }
      }
      /*,
            uijs: {
              src: 'lib/app.uncompressed.js', //压缩源文件是之前合并的buildt.js文件  
              dest: 'lib/app.js'
            }*/
    },
    usemin: {
      html: ['index.html', 'user.html', 'nvwa.jsp', 'user.jsp'],
      options: {
        blockReplacements: {
          css: function(block) {
            var real_path = block.dest;

            real_path = real_path.replace('build', buidPath);

            console.log(real_path);
            var file = real_path + '.css';
            var hash = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
            var suffix = hash.slice(0, 6);
            console.log('suffix=' + suffix);
            var final_name = real_path + '.' + suffix + '.css';
            console.log(final_name);

            return '<!-- build:css ' + block.dest + '-->\n' +
              '\t\t<link rel="stylesheet" href="' + final_name + '">\n' +
              ' <!-- endbuild -->';
          },
          cssJsp: function(block) {
            var real_path = block.dest;

            real_path = real_path.replace('build', buidPath);

            console.log(real_path);
            var file = real_path + '.css';
            var hash = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
            var suffix = hash.slice(0, 6);
            console.log('suffix=' + suffix);
            var final_name = real_path + '.' + suffix + '.css';
            console.log(final_name);

            return '<!-- build:cssJsp ' + block.dest + '-->\n' +
              '\t\t<link rel="stylesheet" href="<%=systemConfig.get("staticResourceUrl")%>/' + final_name + '">\n' +
              ' <!-- endbuild -->';
          },
          jsProducer: function(block) {
            var real_path = block.dest;
            console.log("real_path" + real_path);

            real_path = real_path.replace('build', buidPath);

            var minFile_util = buidPath + '/js/' + md5Str(real_path, 'util').replace('nvwa-client', 'nvwa-client-util');
            var minFile_core = buidPath + '/js/' + md5Str(real_path, 'core').replace('nvwa-client', 'nvwa-client-core');
            //   var minFile_user = buidPath + '/js/' + md5Str(real_path, 'user').replace('nvwa-client', 'nvwa-client-user');
            var minFile_producer = buidPath + '/js/' + md5Str(real_path, 'producer').replace('nvwa-client', 'nvwa-client-producer');

            return '<!-- build:jsProducer ' + block.dest + ' -->\n' +
              '\t\t<script src="' + nvwaLoaderVersion + '.js"\n' +
              '\t\tbaseUrl = "' + buidPath + '/js"\n' +
              '\t\tapi=""\n' +
              '\t\tskin=""\n' +
              '\t\tdebug = "true"\n' +
              '\t\tlang = "zh_CN"\n' +
              '\t\tjsonp = "true"\n' +
              '\t\tnvwa-api=""\n' +
              '\t\tpreload = "' + minFile_util + ',' + minFile_core + ',' + minFile_producer + '" > </script>\n' +
              ' <!-- endbuild -->';
          },
          jsProducerJsp: function(block) {
            var real_path = block.dest;
            console.log("real_path" + real_path);

            real_path = real_path.replace('build', buidPath);

            var minFile_util = '<%=systemConfig.get("staticResourceUrl")%>/' + buidPath + '/js/' + md5Str(real_path, 'util').replace('nvwa-client', 'nvwa-client-util');
            var minFile_core = '<%=systemConfig.get("staticResourceUrl")%>/' + buidPath + '/js/' + md5Str(real_path, 'core').replace('nvwa-client', 'nvwa-client-core');
            //   var minFile_user = buidPath + '/js/' + md5Str(real_path, 'user').replace('nvwa-client', 'nvwa-client-user');
            var minFile_producer = '<%=systemConfig.get("staticResourceUrl")%>/' + buidPath + '/js/' + md5Str(real_path, 'producer').replace('nvwa-client', 'nvwa-client-producer');

            return '<!-- build:jsProducerJsp ' + block.dest + ' -->\n' +
              '\t\t<script src="<%=systemConfig.get("staticResourceUrl")%>/' + nvwaLoaderVersion + '.js"\n' +
              '\t\tbaseUrl = "' + buidPath + '/js"\n' +
              '\t\tapi=""\n' +
              '\t\tskin=""\n' +
              '\t\tdebug = "true"\n' +
              '\t\tlang = "zh_CN"\n' +
              '\t\tjsonp = "true"\n' +
              '\t\tnvwa-api=""\n' +
              '\t\tpreload = "' + minFile_util + ',' + minFile_core + ',' + minFile_producer + '" > </script>\n' +
              ' <!-- endbuild -->';
          },
          jsUser: function(block) {
            var real_path = block.dest;
            console.log("real_path" + real_path);

            real_path = real_path.replace('build', buidPath);

            var minFile_util = buidPath + '/js/' + md5Str(real_path, 'util').replace('nvwa-client', 'nvwa-client-util');
            var minFile_core = buidPath + '/js/' + md5Str(real_path, 'core').replace('nvwa-client', 'nvwa-client-core');
            var minFile_user = buidPath + '/js/' + md5Str(real_path, 'user').replace('nvwa-client', 'nvwa-client-user');
            //    var minFile_producer = buidPath + '/js/' + md5Str(real_path, 'producer').replace('nvwa-client', 'nvwa-client-producer');

            return '<!-- build:jsUser ' + block.dest + ' -->\n' +
              '\t\t<script src="' + nvwaLoaderVersion + '.js"\n' +
              '\t\tbaseUrl = "' + buidPath + '/js"\n' +
              '\t\tapi=""\n' +
              '\t\tskin=""\n' +
              '\t\tdebug = "true"\n' +
              '\t\tlang = "zh_CN"\n' +
              '\t\tjsonp = "true"\n' +
              '\t\tnvwa-api=""\n' +
              '\t\tpreload = "' + minFile_util + ',' + minFile_core + ',' + minFile_user + '" > </script>\n' +
              // '\t\tpreload = "' + minFile_util + ',' + minFile_core + ',' + minFile_producer + '" > </script>\n' +
              ' <!-- endbuild -->';
          },
          jsUserJsp: function(block) {
            var real_path = block.dest;
            console.log("real_path" + real_path);

            real_path = real_path.replace('build', buidPath);

            var minFile_util = '<%=systemConfig.get("staticResourceUrl")%>/' + buidPath + '/js/' + md5Str(real_path, 'util').replace('nvwa-client', 'nvwa-client-util');
            var minFile_core = '<%=systemConfig.get("staticResourceUrl")%>/' + buidPath + '/js/' + md5Str(real_path, 'core').replace('nvwa-client', 'nvwa-client-core');
            var minFile_user = '<%=systemConfig.get("staticResourceUrl")%>/' + buidPath + '/js/' + md5Str(real_path, 'user').replace('nvwa-client', 'nvwa-client-user');
            //    var minFile_producer = buidPath + '/js/' + md5Str(real_path, 'producer').replace('nvwa-client', 'nvwa-client-producer');

            return '<!-- build:jsUserJsp ' + block.dest + ' -->\n' +
              '\t\t<script src="<%=systemConfig.get("staticResourceUrl")%>/' + nvwaLoaderVersion + '.js"\n' +
              '\t\tbaseUrl = "' + buidPath + '/js"\n' +
              '\t\tapi=""\n' +
              '\t\tskin=""\n' +
              '\t\tdebug = "true"\n' +
              '\t\tlang = "zh_CN"\n' +
              '\t\tjsonp = "true"\n' +
              '\t\tnvwa-api=""\n' +
              '\t\tpreload = "' + minFile_util + ',' + minFile_core + ',' + minFile_user + '" > </script>\n' +
              // '\t\tpreload = "' + minFile_util + ',' + minFile_core + ',' + minFile_producer + '" > </script>\n' +
              ' <!-- endbuild -->';
          }
        }
      }
    },
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    copy: {
      main: {
        files: [{ //拷贝lib素材
            src: ['js/bower_components/**'],
            dest: buidPath + '/'
          }, { //拷贝image素材
            src: ['img/**'],
            dest: buidPath + '/'
          }, { //拷贝index素材
            src: ['js/index.js'],
            dest: buidPath + '/'
          }, { //拷贝user index素材
            src: ['js/user/index.js'],
            dest: buidPath + '/'
          }
          /*, { //拷贝css素材
                      src: ['css/**'],
                      dest: buidPath + '/'
                    }, { //拷贝image素材
                      src: ['img/*'],
                      dest: buidPath + '/'
                    }, { //拷贝index.js
                      src: ['js/index.js'],
                      dest: buidPath + '/'
                    }, { //拷贝fonts素材
                      src: ['fonts/*'],
                      dest: buidPath + '/'
                    }*/
          /*, { //拷贝view的模板文件
                      src: ['js/user/template/*'],
                      dest: buidPath + '/'
                    }
                    , { //拷贝view的模板文件
                              src: ['js/util/template/*'],
                              dest: buidPath + '/'
                            }*/
        ]
      }
    }
    //  uglify: {
    //    options: {
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    //    },
    //    build: {
    //      src: 'src/<%= pkg.name %>.js',
    //      dest: 'build/<%= pkg.name %>.min.js'
    //    }
    //  }
  });

  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-svn-export');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-usemin');
  // grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-less');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['uglify']);

  //执行less, concat, uglify
  grunt.registerTask('ui', ['less', 'concat:uijs', 'uglify:uijs']);

  //执行js合并压缩任务
  grunt.registerTask('js', ['jst', 'concat:js', 'uglify']);
  //执行css合并压缩任务
  grunt.registerTask('css', ['concat:css', 'cssmin']);
  //执行任务
  grunt.registerTask('app', ['clean', 'js', 'css', 'filerev', 'copy', 'usemin']);
};