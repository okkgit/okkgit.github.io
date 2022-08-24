---
sidebar:auto

---

# SQL
## sql通用语法
~~~ sql
SELECT column_name, column_ame 
FROM tablename
WHERE id = 1
LIMIT 1 
OFFSET <> 
~~~

### 条件查询
~~~sql
SELECT username FROM student WHERE userid<=1 AND sex=1; 
SELECT username FROM student WHERE userid>=1 OR sex=1; 
SELECT username FROM student WHERE NOT userid>=10; 
SELECT username FROM student WHERE (userid>10 and sex=1) AND NOT score>10;
SELECT username FROM student WHERE score BETWEEN 10 AND 100;
~~~

### 排序查询
~~~sql
SELECT id, username FROM students ORDER BY scores;
SELECT id, username FROM students ORDER BY scores DESC;  -- ASC 升序可以省略
-- 先按照 scores 排序入伙存在相同的再按照id排序 
SELECT id, username FROM students ORDER BY scores DESC, id; 
~~~

### sql 分页查询
~~~sql
-- 每页5条信息，这里查询的是第4页的信息 
SELECT id, username FROM students LIMIT 5 OFFSET 15;
-- 再mysql可以缩写
SELECT id, username FROM students LIMIT 5, 15;
~~~

### sql 聚合查询(统计数量)
~~~sql
SELECT COUNT(*) FROM students;
SELECT COUNT(id) FROM students WHERE id > 100;
-- SUM 计算列的和(id > 10 的所有学生才成绩综合)
SELECT SUM(socre) FROM students WHERE id > 10;
-- AVG 计算列均值(id > 10多有学生平均分，重命名 average)
SELECT AVG(socre) average FROM students WHERE id > 10;

FLOOR(), 舍弃小数点后面的数
CEILING(), 进1
~~~

### sql 分组查询
~~~sql
-- 查询各个班级总共有多少学生
SELECT count(*) FROM students GROUP BY class_id;
-- 分组查询的时候，智能将分组的列显示出来
SELECT class_id, count(*) FROM students GROUP BY class_id;
-- 按照多列进行分组（查询各班男生女生人数情况）
SELECT class_id, sex, count(*) num FROM students GROUP BY class_id, sex;
~~~

### sql 多表查询
~~~sql
-- 多表查询，这里结果是笛卡尔集
SELECT * FROM students, classes;

-- 使用投影解决多表命名相同
SELECT 
    students.id stid,
    classes.id cid,
FROM students, classes;

-- 更简洁
SELECT
    s.id stid,
    c.id cid,
FROM students s, classes c
WHERE s.sex = 1 AND c.id = 1;
 ~~~

### sql 连接查询
一种另类的多表查询
选择一个主表然后将其他表有选择的连接再主表上，然后再查询
~~~ sql
-- 内连接， 当主表里面的信息需要通过类似id从其他表里面获取
-- 内连接只会显示两张表都存在的行的数据
SELECT s.id, s.name, c.name classes_name
FROM students s
INNER JOIN classes c ON s.class_id = c.id
WHERE s.id BETWEEN 3 AND 6;

-- 外连接
-- LEFT OUTER JOIN 左边表都存在的行（如果右表不存在会查询到某些元素NULL）
-- RIGHT OUTER JOIN 右表存在的都会显示
-- FULL OUTER JOIN 左右表出现的行都会显示
~~~

### SQL 子查询，嵌套查询，内查询
~~~sql
-- 单行子查询, (子查询只返回一行，使主查询可以使用 =、<、>等运算)
SELECT name, id, classes_id
from students
where classes_id = (
    select classes_id from classes where classes.id = 2 
);

-- 多行子查询
SELECT s.name sname, s.id stid, classes_id
from students s
where stid in (
    select id from classes where id <100
);

~~~